package cz.xrosecky.terratinker.nodes.number;

import java.util.HashMap;

import org.json.JSONObject;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.nodes.AbstractForkNode;

public class SequenceNode extends AbstractForkNode {

    public SequenceNode(String id, JSONObject json) {
        super(id, json);
    }

    private int steps = 0;
    private Float step;
    private Float from;
    private Float count;

    @Override
    public boolean evaluateNext(Program program, EvaluationState tree) {
        return super.forkRoutine(program, tree, (inputs, output) -> {
            if (step == null || from == null || count == null) {
                return false;
            }

            if (steps >= count) {
                return false;
            }
            float value = from + steps * step;
            steps++;

            // Set the output
            output.addValue("number", new FloatType(value));
            return true;
        });
    }

    @Override
    public void setup(HashMap<String, AbstractType> inputs, EvaluationState tree) {
        steps = 0;
        step = inputs.get("step").getFloatValue();
        from = inputs.get("from").getFloatValue();
        count = inputs.get("count").getFloatValue();
    }
}
