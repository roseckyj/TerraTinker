package cz.xrosecky.terratinker;

import cz.xrosecky.terratinker.evaluation.StaticInfo;
import cz.xrosecky.terratinker.geometry.CoordsTranslator;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.geometry.Vector2DInt;
import org.bukkit.plugin.java.JavaPlugin;
import org.json.JSONArray;
import org.json.JSONObject;

public class Evaluator {
    private final JavaPlugin plugin;

    public Evaluator(JavaPlugin plugin) {
        this.plugin = plugin;
    }

    public void evaluate(String input) {
        plugin.getLogger().info("Executing program");
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

            CoordsTranslator coordsTranslator = new CoordsTranslator(new Vector2D(lat, lon), new Vector2D(0, 0), 0, horizontalScale, verticalScale, 0);
            Vector2DInt size = new Vector2DInt(width, height);

            StaticInfo staticInfo = new StaticInfo(plugin, plugin.getServer().getWorld("world"), coordsTranslator, size);

            JSONArray layers = config.getJSONArray("layers");

            // We want to parse the layers in reverse order (top should be last)
            for (int i = layers.length() - 1; i >= 0; i--) {
                JSONObject layer = layers.getJSONObject(i);
                Program tree = Program.fromJson(layer);

                LayerEvaluator layerEvaluator = new LayerEvaluator(tree);
                layerEvaluator.evaluate(staticInfo);
            }
        } catch (Exception e) {
            plugin.getLogger().warning(e.getMessage());
        }
        long finish = System.currentTimeMillis();
        long timeElapsed = finish - start;
        plugin.getLogger().info("Finished in " + timeElapsed + " ms");
    }
}
