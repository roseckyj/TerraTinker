package cz.xrosecky.terratinker.nodes;

import java.util.HashMap;
import java.util.function.BiConsumer;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluationTree.EvaluationTree;
import cz.xrosecky.terratinker.evaluationTree.NodeOutput;
import cz.xrosecky.terratinker.evaluationTree.NodeOutputResolver;
import cz.xrosecky.terratinker.evaluationTree.outputType.AbstractType;
import cz.xrosecky.terratinker.nodeInput.AbstractNodeInput;
import cz.xrosecky.terratinker.nodeInput.LinkNodeInput;
import cz.xrosecky.terratinker.nodeInput.ValueNodeInput;

public abstract class AbstractActionNode extends AbstractNode {
    public AbstractActionNode(String id, JSONObject json) {
        super(id, json);
    }

    protected AbstractNode actionRoutine(Program program, EvaluationTree tree,
            BiConsumer<HashMap<String, AbstractType>, NodeOutput> resolver) {
        NodeOutput output = new NodeOutput();
        AbstractNode fork = evaluatePrerequisites(program, tree);

        // Evaluate "ignore" input first
        AbstractNodeInput ignoreInput = inputs.get("ignore");
        if (fork == null && ignoreInput instanceof LinkNodeInput) {
            AbstractNode linkInput = program.getNode(((LinkNodeInput) ignoreInput).nodeId);
            if (!tree.contains(linkInput.id)) {
                fork = linkInput.evaluate(program, tree);
            }
        }

        // If ignore is true, do not evaluate this node
        if (fork == null) {
            if (ignoreInput instanceof ValueNodeInput) {
                AbstractType ignoreValue = ((ValueNodeInput) ignoreInput).getValue();
                if (ignoreValue.isNull() || ignoreValue.getBooleanValue()) {
                    tree.set(id, NodeOutputResolver.Empty());
                    return null;
                }
            } else {
                assert ignoreInput instanceof LinkNodeInput;
                LinkNodeInput linkInput = (LinkNodeInput) ignoreInput;
                AbstractNode linkNode = program.getNode(linkInput.nodeId);
                if (!tree.contains(linkNode.id)) {
                    fork = linkNode.evaluate(program, tree);
                }

                NodeOutput ignoreOutput = tree.get(linkInput.nodeId).resolve();
                AbstractType ignoreValue = ignoreOutput.getValue(linkInput.outputId);
                if (ignoreValue.isNull() || ignoreValue.getBooleanValue()) {
                    if (fork == null) {
                        tree.set(id, NodeOutputResolver.Empty());
                    }
                    return fork;
                }
            }
        }

        if (fork == null) {
            fork = evaluateInputs(program, tree);
        }
        if (fork != null) {
            return fork;
        }

        // Evaluate this node
        HashMap<String, AbstractType> inputs = getInputs(tree);
        resolver.accept(inputs, output);

        // Set the output
        tree.set(id, new NodeOutputResolver(output));
        return null;
    }
}
