package cz.xrosecky.terratinker.nodes;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluationTree.EvaluationTree;

public class LoggingNode extends AbstractActionNode {

    public LoggingNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationTree tree) {
        return super.actionRoutine(program, tree, (inputs, output) -> {
            StringBuilder sb = new StringBuilder();
            inputs.forEach((key, value) -> {
                sb.append(key).append(": ").append(value.getStringValue()).append(", ");
            });
            System.out.println(sb);
        });
    }
}
