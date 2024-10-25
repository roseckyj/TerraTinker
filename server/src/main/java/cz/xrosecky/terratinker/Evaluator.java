package cz.xrosecky.terratinker;

import java.util.Timer;

import org.bukkit.Difficulty;
import org.bukkit.World;
import org.bukkit.WorldCreator;
import org.bukkit.WorldType;
import org.json.JSONArray;
import org.json.JSONObject;

import cz.xrosecky.terratinker.evaluation.EvaluationCanceledException;
import cz.xrosecky.terratinker.evaluation.StaticInfo;
import cz.xrosecky.terratinker.geometry.CoordsTranslator;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.geometry.Vector2DInt;
import cz.xrosecky.terratinker.geometry.Vector3DInt;
import cz.xrosecky.terratinker.server.VoidGen;

public class Evaluator {
    public final String id;
    private static final int PREVIEW_SIZE = 16 * 4;
    private long timeout;
    private final TerraTinker plugin;
    private final String input;
    private final boolean isPreview;
    private World world;

    private EvaluatorStatus status = EvaluatorStatus.READY;

    public Evaluator(TerraTinker plugin, String input, boolean isPreview) {
        this.id = java.util.UUID.randomUUID().toString();
        this.plugin = plugin;
        this.input = input;
        this.isPreview = isPreview;

        try {
            JSONObject config = new JSONObject(input);
            this.timeout = config.getLong("timeout");
        } catch (Exception e) {
            this.timeout = 1000 * 60; // 1 minute
        }
    }

    public void evaluate() {
        // Set timeout,
        Timer timer = new Timer();

        timer.schedule(new java.util.TimerTask() {
            @Override
            public void run() {
                plugin.getLogger().warning("Session " + id + " timed out");
                status = EvaluatorStatus.TIMEOUT;
            }
        }, timeout);

        plugin.getServer().getScheduler().runTask(plugin, () -> {
            this.status = EvaluatorStatus.RUNNING;
            long start = System.currentTimeMillis();

            // Create a new world
            WorldCreator creator = new WorldCreator(id);
            creator.type(WorldType.FLAT);
            creator.generatorSettings("{\"layers\": [{\"block\": \"air\", \"height\": 1}], \"biome\":\"plains\"}");
            creator.environment(World.Environment.NORMAL);
            creator.generateStructures(false);
            creator.generator(new VoidGen());
            world = plugin.getServer().createWorld(creator);
            if (world == null) {
                throw new RuntimeException("Could not create world");
            }
            world.setDifficulty(Difficulty.PEACEFUL);
            try {
                JSONObject config = new JSONObject(input);

                JSONArray mapCenter = config.getJSONArray("mapCenter");
                float lat = mapCenter.getFloat(0);
                float lon = mapCenter.getFloat(1);
                JSONObject scale = config.getJSONObject("scale");
                float horizontalScale = scale.getFloat("horizontal");
                float verticalScale = scale.getFloat("vertical");
                JSONObject mapSize = config.getJSONObject("mapSize");
                int width = mapSize.getInt("width");
                int height = mapSize.getInt("height");
                float minAltitude = config.getFloat("minAltitude");

                CoordsTranslator coordsTranslator = new CoordsTranslator(new Vector2D(lat, lon), new Vector2D(0, 0), 0,
                        horizontalScale, verticalScale, world.getMinHeight());
                coordsTranslator.setAltShift((int) (-minAltitude + 10 + 10 * verticalScale));
                Vector2DInt size = isPreview ? new Vector2DInt(PREVIEW_SIZE, PREVIEW_SIZE)
                        : new Vector2DInt(width, height);

                StaticInfo staticInfo = new StaticInfo(plugin, world, this, coordsTranslator, size, minAltitude,
                        isPreview ? new Vector3DInt(512 / 2, 0, 512 / 2) : new Vector3DInt(0, 0, 0));

                JSONArray layers = config.getJSONArray("layers");

                // We want to parse the layers in reverse order (top should be last)
                for (int i = layers.length() - 1; i >= 0; i--) {
                    JSONObject layer = layers.getJSONObject(i);

                    if (layer.has("disabled") && layer.getBoolean("disabled")) {
                        continue;
                    }

                    Program tree = Program.fromJson(layer);

                    LayerEvaluator layerEvaluator = new LayerEvaluator(tree);
                    layerEvaluator.evaluate(staticInfo);
                }

                this.status = EvaluatorStatus.FINISHED;
            } catch (EvaluationCanceledException ignored) {
            } catch (Exception e) {
                this.status = EvaluatorStatus.ERROR;
            }

            world.save();
            plugin.getServer().unloadWorld(world, false);
            timer.cancel();

            long finish = System.currentTimeMillis();
            long timeElapsed = finish - start;
            plugin.getLogger().info("Finished in " + timeElapsed + " ms");
        });
    }

    public EvaluatorStatus getStatus() {
        return status;
    }

    public void cancel() {
        this.status = EvaluatorStatus.CANCELED;
    }

    public boolean shouldStop() {
        return status == EvaluatorStatus.CANCELED || status == EvaluatorStatus.ERROR
                || status == EvaluatorStatus.TIMEOUT;
    }

    public World getWorld() {
        return world;
    }
}