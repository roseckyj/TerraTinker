package cz.xrosecky.terratinker.evaluationTree;

import java.util.HashMap;

import cz.xrosecky.terratinker.evaluationTree.NodeOutputResolver;

public class EvaluationTree {
    private HashMap<String, NodeOutputResolver> outputs = new HashMap<>();

    public EvaluationTree() {

    }

    private EvaluationTree(HashMap<String, NodeOutputResolver> outputs) {
        this.outputs = new HashMap<>(outputs);
    }

    public EvaluationTree cloneTree() {
        return new EvaluationTree(outputs);
    }

    public void set(String name, NodeOutputResolver output) {
        outputs.put(name, output);
    }

    public NodeOutputResolver get(String name) {
        return outputs.get(name);
    }

    public boolean contains(String name) {
        return outputs.containsKey(name);
    }
}
