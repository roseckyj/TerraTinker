package cz.xrosecky.terratinker.nodes;

import java.util.HashMap;
import java.util.List;
import java.util.function.BiConsumer;

import cz.xrosecky.terratinker.evaluation.*;
import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;
import cz.xrosecky.terratinker.nodeInput.AbstractNodeInput;
import cz.xrosecky.terratinker.nodeInput.LinkNodeInput;
import cz.xrosecky.terratinker.nodeInput.ValueNodeInput;

public abstract class AbstractNode {
    public final String id;
    protected HashMap<String, AbstractNodeInput> inputs;

    public AbstractNode(String id, JSONObject json) {
        // {
        // "type":"<nodeType>",
        // "inputs":{
        // "<inputId>":{"kind":"value","type":"<dataType>","value":"<value>"},
        // "<inputId>":{"kind":"link","node":"<nodeId>","output":"<outputId>"}
        // },
        // "nodeData":{
        // ...custom node data...
        // }
        // }

        this.id = id;
        this.inputs = new HashMap<>();
        json.getJSONObject("inputs").keySet().forEach(key -> {
            JSONObject inputJson = json.getJSONObject("inputs").getJSONObject(key);
            this.inputs.put(key, AbstractNodeInput.createInput(inputJson));
        });
    }

    protected InputMap getInputs(EvaluationState tree) {
        InputMap inputs = new InputMap();
        for (String inputId : this.inputs.keySet()) {
            AbstractNodeInput input = this.inputs.get(inputId);

            AbstractType value;
            if (input instanceof LinkNodeInput) {
                value = tree.get(((LinkNodeInput) input).nodeId).resolve().getValue(((LinkNodeInput) input).outputId);
            } else {
                value = ((ValueNodeInput) input).getValue();
            }
            inputs.put(inputId, value);
        }
        return inputs;
    }

    protected AbstractNode evaluatePrerequisites(Program program, EvaluationState tree) {
        List<AbstractNode> prerequisites = program.getflowPrerequisities(this);

        AbstractNode firstFork = null;

        for (AbstractNode prerequisite : prerequisites) {
            if (!tree.contains(prerequisite.id)) {
                AbstractNode fork = prerequisite.evaluate(program, tree);
                if (fork != null && firstFork == null) {
                    firstFork = fork;
                }
            }
        }

        return firstFork;
    }

    protected AbstractNode evaluateInputs(Program program, EvaluationState tree) {
        AbstractNode firstFork = null;

        for (AbstractNodeInput input : inputs.values()) {
            if (input instanceof LinkNodeInput) {
                AbstractNode linkInput = program.getNode(((LinkNodeInput) input).nodeId);
                if (!tree.contains(linkInput.id)) {
                    AbstractNode fork = linkInput.evaluate(program, tree);
                    if (fork != null && firstFork == null) {
                        firstFork = fork;
                    }
                }
            }
        }

        return firstFork;
    }

    public abstract AbstractNode evaluate(Program program, EvaluationState tree);

    protected AbstractNode evaluationRoutine(Program program, EvaluationState tree,
            BiConsumer<InputMap, NodeOutput> resolver) {
        if (tree.info().evaluator.shouldStop()) {
            throw new EvaluationCanceledException();
        }
        AbstractNode fork = evaluatePrerequisites(program, tree);
        if (fork == null) {
            fork = evaluateInputs(program, tree);
        }
        if (fork != null) {
            return fork;
        }

        // Set the output
        tree.set(id, new NodeOutputResolver(resolver, () -> getInputs(tree)));
        return null;
    }
}
