package cz.xrosecky.terratinker.nodes;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluationTree.EvaluationTree;

public class VoidNode extends AbstractNode {

    public VoidNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationTree tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
        });
    }
}
