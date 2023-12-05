package cz.xrosecky.terratinker.evaluation;

import java.util.HashMap;

import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;

public class NodeOutput {
    private final InputMap values = new InputMap();

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
