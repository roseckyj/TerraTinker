package cz.xrosecky.terratinker.evaluationTree;

import java.util.HashMap;

import cz.xrosecky.terratinker.evaluationTree.outputType.AbstractType;

public class NodeOutput {
    private final HashMap<String, AbstractType> values = new HashMap<>();

    public void addValue(String key, AbstractType value) {
        values.put(key, value);
    }

    public AbstractType getValue(String key) {
        return values.get(key);
    }

    public void addAll(NodeOutput output) {
        values.putAll(output.values);
    }
}
