package cz.xrosecky.terratinker.nodes.material;

import java.util.ArrayList;
import java.util.List;

import kotlin.Pair;
import org.bukkit.Material;
import org.json.JSONArray;
import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.MaterialType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class MaterialScaleNode extends AbstractNode {
    private final Material defaultMaterial;
    private final List<Pair<Float, Material>> scale;

    public MaterialScaleNode(String id, JSONObject json) {
        super(id, json);

        JSONObject nodeData = json.getJSONObject("nodeData");
        defaultMaterial = MaterialType.materialFromString(nodeData.getString("defaultMaterial"));

        scale = new ArrayList<>();
        JSONArray scaleArray = nodeData.getJSONArray("scale");
        for (int i = 0; i < scaleArray.length(); i++) {
            JSONObject scaleEntry = scaleArray.getJSONObject(i);
            float value = scaleEntry.getFloat("from");
            Material material = MaterialType.materialFromString(scaleEntry.getString("material"));
            scale.add(new Pair<>(value, material));
        }
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Float min = inputs.get("min").getFloatValue();
            Float max = inputs.get("max").getFloatValue();
            Float input = inputs.get("input").getFloatValue();

            if (min == null || max == null || input == null) {
                output.addValue("output", new NullType());
                return;
            }

            boolean flip = false;

            if (min > max) {
                Float tmp = min;
                min = max;
                max = tmp;

                flip = true;
            }

            input -= min;
            input /= max - min;

            if (flip) {
                input = 1 - input;
            }

            for (int i = 0; i < scale.size(); i++) {
                Pair<Float, Material> entry = scale.get(i);
                float value = entry.getFirst();
                if (input < value) {
                    if (i == 0) {
                        output.addValue("output", new MaterialType(defaultMaterial));
                    } else {
                        output.addValue("output", new MaterialType(scale.get(i - 1).getSecond()));
                    }
                    return;
                }
            }

            output.addValue("output", new MaterialType(scale.get(scale.size() - 1).getSecond()));
        });
    }
}
