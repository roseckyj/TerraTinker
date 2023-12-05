package cz.xrosecky.terratinker.evaluation;

import java.util.HashMap;
import java.util.function.BiConsumer;
import java.util.function.Supplier;

import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;

public class NodeOutputResolver {
    private final BiConsumer<InputMap, NodeOutput> resolver;
    private final Supplier<InputMap> inputs;

    public NodeOutputResolver(BiConsumer<InputMap, NodeOutput> resolver, Supplier<InputMap> inputs) {
        this.resolver = resolver;
        this.inputs = inputs;
    }

    public NodeOutputResolver(NodeOutput output) {
        this.resolver = (inputs, output1) -> output1.addAll(output);
        this.inputs = InputMap::new;
    }

    public NodeOutput resolve() {
        NodeOutput output = new NodeOutput();
        resolver.accept(inputs.get(), output);
        return output;
    }

    public static NodeOutputResolver Empty() {
        return new NodeOutputResolver(new NodeOutput());
    }
}
