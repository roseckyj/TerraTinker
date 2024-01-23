package cz.xrosecky.terratinker.nodes.material;

import org.bukkit.Material;
import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.MaterialType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class MaterialByName extends AbstractNode {

    public MaterialByName(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            String value = inputs.get("name").getStringValue();
            Material material = MaterialType.materialFromString(value);

            if (value == null || material == null) {
                output.addValue("output", new NullType());
                return;
            }

            output.addValue("output", new MaterialType(material));
        });
    }
}
