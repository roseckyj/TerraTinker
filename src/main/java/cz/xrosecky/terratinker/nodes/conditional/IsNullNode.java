package cz.xrosecky.terratinker.nodes.conditional;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.BooleanType;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class IsNullNode extends AbstractNode {

    public IsNullNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            boolean input = inputs.get("input").isNull();

            output.addValue("output", new BooleanType(input));
        });
    }
}
