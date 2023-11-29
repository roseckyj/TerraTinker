package cz.xrosecky.terratinker.nodes.bool;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.BooleanType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class NotNode extends AbstractNode {

    public NotNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Boolean input = inputs.get("input").getBooleanValue();

            if (input == null) {
                output.addValue("output", new NullType());
                return;
            }

            output.addValue("output", new BooleanType(!input));
        });
    }
}
