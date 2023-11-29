package cz.xrosecky.terratinker.nodes.number;

import java.util.Random;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluationTree.EvaluationTree;
import cz.xrosecky.terratinker.evaluationTree.outputType.FloatType;
import cz.xrosecky.terratinker.evaluationTree.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;

public class RandomNumberNode extends AbstractNode {
    private final boolean randomSeed;

    public RandomNumberNode(String id, JSONObject json) {
        super(id, json);

        randomSeed = json.getJSONObject("nodeData").getBoolean("randomSeed");
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationTree tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Float from = inputs.get("from").getFloatValue();
            Float to = inputs.get("to").getFloatValue();
            Float seed = inputs.get("seed").getFloatValue();
            Boolean decimal = inputs.get("decimal").getBooleanValue();

            if (from == null || to == null || decimal == null) {
                output.addValue("output", new NullType());
                return;
            }

            if (seed == null || randomSeed) {
                seed = (float) Math.random();
            }
            Random random = new Random((int) (seed * 100000));

            float value = from + random.nextFloat() * (to - from);
            if (!decimal) {
                value = Math.round(value);
            }

            output.addValue("output", new FloatType(value));
        });
    }
}
