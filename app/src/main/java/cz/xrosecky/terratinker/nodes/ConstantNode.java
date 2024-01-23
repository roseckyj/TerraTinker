package cz.xrosecky.terratinker.nodes;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;

public class ConstantNode extends AbstractNode {

    public ConstantNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            AbstractType value = inputs.get("input");
            output.addValue("output", value);
        });
    }
}
