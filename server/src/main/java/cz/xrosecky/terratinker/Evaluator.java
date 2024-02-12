package cz.xrosecky.terratinker;

import cz.xrosecky.terratinker.evaluation.StaticInfo;
import cz.xrosecky.terratinker.geometry.CoordsTranslator;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.geometry.Vector2DInt;
import cz.xrosecky.terratinker.geometry.Vector3DInt;
import org.bukkit.World;
import org.bukkit.plugin.java.JavaPlugin;
import org.json.JSONArray;
import org.json.JSONObject;

public class Evaluator {
    private static final int PREVIEW_SIZE = 16 * 4;
    private final JavaPlugin plugin;
    private final boolean isPreview;
    private boolean running = false;

    public Evaluator(JavaPlugin plugin, boolean isPreview) {
        this.plugin = plugin;
        this.isPreview = isPreview;
    }

    public void evaluate(String input, World world) {
        running = true;
        long start = System.currentTimeMillis();
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

            CoordsTranslator coordsTranslator = new CoordsTranslator(new Vector2D(lat, lon), new Vector2D(0, 0), 0, horizontalScale, verticalScale, world.getMinHeight());
            coordsTranslator.setAltShift((int)(-minAltitude + 10 + 10 * verticalScale));
            Vector2DInt size = isPreview ? new Vector2DInt(PREVIEW_SIZE, PREVIEW_SIZE) : new Vector2DInt(width, height);

            StaticInfo staticInfo = new StaticInfo(plugin, world, coordsTranslator, size, minAltitude, isPreview ? new Vector3DInt(512 / 2, 0, 512 / 2) : new Vector3DInt(0, 0, 0));

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
        } catch (Exception e) {
            e.printStackTrace();
//            plugin.getLogger().warning(e.getMessage());
        }
        world.save();
        running = false;
        long finish = System.currentTimeMillis();
        long timeElapsed = finish - start;
        plugin.getLogger().info("Finished in " + timeElapsed + " ms");
    }

    public boolean isRunning() {
        return running;
    }
}
