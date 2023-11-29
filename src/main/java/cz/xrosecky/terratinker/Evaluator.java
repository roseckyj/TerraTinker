package cz.xrosecky.terratinker;

import cz.xrosecky.terratinker.evaluation.StaticInfo;
import org.bukkit.plugin.java.JavaPlugin;
import org.json.JSONArray;
import org.json.JSONObject;

public class Evaluator {
    private final JavaPlugin plugin;

    public Evaluator(JavaPlugin plugin) {
        this.plugin = plugin;
    }

    public void evaluate(String input) {
        StaticInfo staticInfo = new StaticInfo(plugin.getServer().getWorld("world"));

        JSONObject config = new JSONObject(input);
        JSONArray layers = config.getJSONArray("layers");

        // We want to parse the layers in reverse order (top should be last)
        for (int i = layers.length() - 1; i >= 0; i--) {
            JSONObject layer = layers.getJSONObject(i);
            Program tree = Program.fromJson(layer);

            LayerEvaluator layerEvaluator = new LayerEvaluator(tree);
            layerEvaluator.evaluate(staticInfo);
        }
    }
}
