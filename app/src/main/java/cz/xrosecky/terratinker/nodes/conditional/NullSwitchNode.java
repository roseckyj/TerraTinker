package cz.xrosecky.terratinker.nodes.conditional;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class NullSwitchNode extends AbstractNode {

    private final int cases;

    public NullSwitchNode(String id, JSONObject json) {
        super(id, json);
        cases = json.getJSONObject("nodeData").getInt("cases");
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            for (int i = 0; i < cases; i++) {
                String inputId = i + "_case";

                AbstractType input = inputs.get(inputId);
                if (input == null || input.isNull()) {
                    continue;
                }

                output.addValue("output", input);
                return;
            }

            output.addValue("output", new NullType());
        });
    }
}
