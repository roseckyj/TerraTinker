package cz.xrosecky.terratinker.evaluationTree;

import java.util.HashMap;
import java.util.function.BiConsumer;
import java.util.function.Supplier;

import cz.xrosecky.terratinker.evaluationTree.outputType.AbstractType;

public class NodeOutputResolver {
    private final BiConsumer<HashMap<String, AbstractType>, NodeOutput> resolver;
    private final Supplier<HashMap<String, AbstractType>> inputs;

    public NodeOutputResolver(BiConsumer<HashMap<String, AbstractType>, NodeOutput> resolver,
            Supplier<HashMap<String, AbstractType>> inputs) {
        this.resolver = resolver;
        this.inputs = inputs;
    }

    public NodeOutputResolver(NodeOutput output) {
        this.resolver = (inputs, output1) -> output1.addAll(output);
        this.inputs = HashMap::new;
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
