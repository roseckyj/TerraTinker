package cz.xrosecky.terratinker.types;

import org.json.JSONArray;
import org.json.JSONObject;

import cz.xrosecky.terratinker.LayerEvaluator;
import cz.xrosecky.terratinker.Program;

public class Evaluator {
    public void evaluate(String input) {
        JSONObject config = new JSONObject(input);
        JSONArray layers = config.getJSONArray("layers");

        // We want to parse the layers in reverse order (top should be last)
        for (int i = layers.length() - 1; i >= 0; i--) {
            JSONObject layer = layers.getJSONObject(i);
            Program tree = Program.fromJson(layer);

            LayerEvaluator layerEvaluator = new LayerEvaluator(tree);
            layerEvaluator.evaluate();
        }
    }
}
