package cz.xrosecky.terratinker.nodes.material;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluationTree.EvaluationTree;
import cz.xrosecky.terratinker.evaluationTree.outputType.MaterialType;
import cz.xrosecky.terratinker.evaluationTree.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class MaterialByName extends AbstractNode {

    public MaterialByName(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationTree tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            String value = inputs.get("name").getStringValue();

            if (value == null) {
                output.addValue("output", new NullType());
                return;
            }

            output.addValue("output", MaterialType.fromString(value));
        });
    }
}
