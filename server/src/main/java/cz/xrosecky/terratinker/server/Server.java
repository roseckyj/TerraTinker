package cz.xrosecky.terratinker.server;

import java.io.File;
import java.io.FileInputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Evaluator;
import cz.xrosecky.terratinker.EvaluatorStatus;
import cz.xrosecky.terratinker.TerraTinker;
import io.javalin.Javalin;
import io.javalin.plugin.bundled.CorsPluginConfig;
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.model.ExcludeFileFilter;
import net.lingala.zip4j.model.ZipParameters;

public class Server implements Runnable {
    private final TerraTinker plugin;
    private final Javalin app;
    private final Queue<Evaluator> queue = new ConcurrentLinkedQueue<>();
    private final Map<String, Evaluator> sessions = new HashMap<>();
    private Evaluator currentSession = null;

    public Server(TerraTinker plugin, int port) {
        this.plugin = plugin;

        app = Javalin.create(config -> {
            config.plugins.enableCors(cors -> {
                cors.add(CorsPluginConfig::anyHost);
            });
        });

        this.setupEndpoints();

        app.start(port);

        plugin.getServer().getScheduler().runTaskTimer(plugin, this, 0, 1);
    }

    public void stop() {
        app.stop();
    }

    private void setupEndpoints() {
        // app.get("/", ctx -> ctx.redirect("/McVizFrontend"));

        app.get("/api/status", ctx -> {
            JSONObject response = new JSONObject();
            response.put("status", "ok");
            response.put("queued", queue.size() + (currentSession != null ? 1 : 0));
            response.put("version", plugin.getServer().getMinecraftVersion());

            ctx.status(200);
            ctx.result(response.toString(4));
        });

        app.post("/api/run", ctx -> {
            try {
                String body = ctx.body();
                Evaluator session = new Evaluator(plugin, body, false);
                queue.add(session);
                sessions.put(session.id, session);

                JSONObject response = new JSONObject();
                response.put("status", "ok");
                response.put("id", session.id);

                ctx.status(200);
                ctx.result(response.toString(4));
            } catch (Exception e) {
                ctx.status(500);
                ctx.result(e.getMessage());
            }
        });

        app.post("/api/preview", ctx -> {
            try {
                String body = ctx.body();
                Evaluator session = new Evaluator(plugin, body, true);
                queue.add(session);
                sessions.put(session.id, session);

                JSONObject response = new JSONObject();
                response.put("status", "ok");
                response.put("id", session.id);

                ctx.status(200);
                ctx.result(response.toString(4));
            } catch (Exception e) {
                ctx.status(500);
                ctx.result(e.getMessage());
            }
        });

        app.get("/api/session/{id}", ctx -> {
            String id = ctx.pathParam("id");

            Evaluator session = sessions.get(id);
            if (session == null) {
                error("Session not found", ctx);
                return;
            }

            JSONObject response = new JSONObject();
            response.put("status", "ok");
            response.put("id", session.id);
            if (queue.contains(session))
                response.put("state", "queued");
            else if (session.getStatus() == EvaluatorStatus.RUNNING || session == currentSession)
                response.put("state", "running");
            else if (session.getStatus() == EvaluatorStatus.CANCELED)
                response.put("state", "canceled");
            else if (session.getStatus() == EvaluatorStatus.ERROR)
                response.put("state", "error");
            else if (session.getStatus() == EvaluatorStatus.TIMEOUT)
                response.put("state", "timeout");
            else
                response.put("state", "finished");

            ctx.status(200);
            ctx.result(response.toString(4));
        });

        app.get("/api/session/{id}/cancel", ctx -> {
            String id = ctx.pathParam("id");

            Evaluator session = sessions.get(id);
            if (session == null) {
                error("Session not found", ctx);
                return;
            }

            JSONObject response = new JSONObject();
            response.put("status", "ok");
            response.put("id", session.id);
            if (queue.contains(session)) {
                session.cancel();
                queue.remove(session);
            } else if (session.getStatus() == EvaluatorStatus.RUNNING || session == currentSession) {
                session.cancel();
            }

            ctx.status(200);
            ctx.result(response.toString(4));
        });

        app.get("/api/session/{id}/zip", ctx -> {
            String id = ctx.pathParam("id");

            Evaluator session = sessions.get(id);
            if (session == null) {
                error("Session not found", ctx);
                return;
            }

            // Find the region file and serve it
            File worldFolder = new File(plugin.getServer().getWorldContainer(), session.getWorld().getName());
            File zipFile = new File(worldFolder, "world.zip");

            if (!zipFile.exists()) {
                // Create the zip file

                try {
                    ZipFile zip = new ZipFile(zipFile);
                    ExcludeFileFilter excludeFileFilter = file -> file.getName().endsWith(".lock");
                    ZipParameters zipParameters = new ZipParameters();
                    zipParameters.setExcludeFileFilter(excludeFileFilter);
                    zipParameters.setIncludeRootFolder(false);
                    zip.addFolder(worldFolder, zipParameters);
                    zip.close();
                } catch (Exception e) {
                    error("Failed to create zip file", ctx);
                    return;
                }
            }

            ctx.status(200);
            // Result an input stream of the file
            ctx.result(new FileInputStream(zipFile));
        });

        app.get("/api/session/{id}/region/{x}/{z}", ctx -> {
            String id = ctx.pathParam("id");
            int x = Integer.parseInt(ctx.pathParam("x"));
            int z = Integer.parseInt(ctx.pathParam("z"));

            Evaluator session = sessions.get(id);
            if (session == null) {
                error("Session not found", ctx);
                return;
            }

            // Find the region file and serve it
            File worldFolder = new File(plugin.getServer().getWorldContainer(), session.getWorld().getName());
            File regionFolder = new File(worldFolder, "region");
            File regionFile = new File(regionFolder, "r." + x + "." + z + ".mca");

            if (!regionFile.exists()) {
                error("Region not found", ctx);
                return;
            }

            ctx.status(200);
            // Result an input stream of the file
            ctx.result(new FileInputStream(regionFile));
        });
    }

    @Override
    public void run() {
        // Test if a session is finished
        if (currentSession != null && currentSession.getStatus() != EvaluatorStatus.RUNNING) {
            plugin.getLogger().info("Session " + currentSession.id + " finished");
            currentSession = null;
        }

        // Start a new session if possible
        if (currentSession == null && !queue.isEmpty()) {
            currentSession = queue.poll();
            currentSession.evaluate();
            plugin.getLogger().info("Session " + currentSession.id + " started");
        }
    }

    private void error(String message, io.javalin.http.Context ctx) {
        JSONObject response = new JSONObject();
        response.put("status", "error");
        response.put("message", message);

        ctx.status(404);
        ctx.result(response.toString(4));
    }
}
