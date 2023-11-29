package cz.xrosecky.terratinker.nodes.string;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluationTree.EvaluationTree;
import cz.xrosecky.terratinker.evaluationTree.outputType.NullType;
import cz.xrosecky.terratinker.evaluationTree.outputType.StringType;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class ToStringNode extends AbstractNode {

    public ToStringNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationTree tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            String value = inputs.get("input").getStringValue();

            if (value == null) {
                output.addValue("output", new NullType());
                return;
            }

            output.addValue("output", new StringType(value));
        });
    }
}
