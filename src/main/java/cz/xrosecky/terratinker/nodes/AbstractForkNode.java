package cz.xrosecky.terratinker.nodes;

import java.util.HashMap;
import java.util.function.BiFunction;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.NodeOutput;
import cz.xrosecky.terratinker.evaluation.NodeOutputResolver;
import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;

public abstract class AbstractForkNode extends AbstractNode {
    public AbstractForkNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        AbstractNode fork = super.evaluatePrerequisites(program, tree);
        if (fork == null) {
            fork = super.evaluateInputs(program, tree);
        }
        if (fork != null) {
            return fork;
        }

        HashMap<String, AbstractType> inputs = getInputs(tree);
        this.setup(inputs);

        return this;
    }

    public void setup(HashMap<String, AbstractType> inputs) {
    }

    public void teardown() {
    }

    public abstract boolean evaluateNext(Program program, EvaluationState tree);

    protected boolean forkRoutine(Program program, EvaluationState tree,
            BiFunction<HashMap<String, AbstractType>, NodeOutput, Boolean> resolver) {
        HashMap<String, AbstractType> inputs = getInputs(tree);
        NodeOutput output = new NodeOutput();

        // Evaluate this node
        boolean notFinished = resolver.apply(inputs, output);

        if (notFinished) {
            // Set the output
            tree.set(id, new NodeOutputResolver(output));
            return true;
        }

        teardown();
        return false;
    }
}
