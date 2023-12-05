package cz.xrosecky.terratinker.evaluation;

import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;

import java.util.HashMap;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

public class InputMap {
    private final HashMap<String, AbstractType> inputs = new HashMap<>();

    public AbstractType put(String key, AbstractType value) {
        inputs.put(key, value);
        return value;
    }

    public AbstractType get(String key) {
        if (inputs.containsKey(key)) {
            return inputs.get(key);
        }
        return new NullType();
    }

    public void putAll(InputMap values) {
        inputs.putAll(values.inputs);
    }

    public void forEach(BiConsumer<String, AbstractType> action) {
        inputs.forEach(action);
    }
}
