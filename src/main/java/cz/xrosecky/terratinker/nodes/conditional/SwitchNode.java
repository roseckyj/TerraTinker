package cz.xrosecky.terratinker.nodes.conditional;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class SwitchNode extends AbstractNode {

    private final int cases;

    public SwitchNode(String id, JSONObject json) {
        super(id, json);
        cases = json.getJSONObject("nodeData").getInt("cases");
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            AbstractType value = inputs.get("value");
            AbstractType default_case = inputs.get("default");

            for (int i = 0; i < cases; i++) {
                AbstractType caseComparator = inputs.get(i + "_case");
                AbstractType caseValue = inputs.get(i + "_use");

                if (caseComparator.equals(value)) {
                    output.addValue("output", caseValue);
                    return;
                }
            }

            output.addValue("output", default_case);
        });
    }
}
