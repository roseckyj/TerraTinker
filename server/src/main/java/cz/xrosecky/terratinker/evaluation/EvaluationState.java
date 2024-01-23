package cz.xrosecky.terratinker.evaluation;

import java.util.HashMap;

public class EvaluationState {
    private HashMap<String, NodeOutputResolver> outputs = new HashMap<>();

    public final StaticInfo staticInfo;

    public EvaluationState(StaticInfo staticInfo) {
        this.staticInfo = staticInfo;
    }

    private EvaluationState(EvaluationState original) {
        this.outputs = new HashMap<>(original.outputs);
        this.staticInfo = original.staticInfo;
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


    public EvaluationState cloneTree() {
        return new EvaluationState(this);
    }

    public StaticInfo info() {
        return staticInfo;
    }
}
