package cz.xrosecky.terratinker;

import cz.xrosecky.terratinker.types.Evaluator;
import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;
import io.javalin.plugin.bundled.CorsPluginConfig;
import org.bukkit.plugin.java.JavaPlugin;

public final class TerraTinker extends JavaPlugin {
    private Javalin app;

    @Override
    public void onEnable() {
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        Thread.currentThread().setContextClassLoader(this.getClassLoader());

        Evaluator evaluator = new Evaluator();

        app = Javalin.create(config -> {
            config.plugins.enableCors(cors -> {
                cors.add(CorsPluginConfig::anyHost);
            });
        });
        app.get("/", ctx -> ctx.redirect("/McVizFrontend"));
        app.get("/api", ctx -> {
            ctx.status(200);
            ctx.result("Server is running");
        });
        app.post("/api/evaluate", ctx -> {
            try {
                String body = ctx.body();
                this.getServer().getScheduler().runTask(this, () -> {
                    evaluator.evaluate(body);
                });
                ctx.status(200);
                ctx.result("Queued for evaluation");
            } catch (Exception e) {
                ctx.status(500);
                ctx.result(e.getMessage());
            }
        });
        app.start(7070);
        Thread.currentThread().setContextClassLoader(classLoader);
    }

    @Override
    public void onDisable() {
        app.stop();
    }
}
