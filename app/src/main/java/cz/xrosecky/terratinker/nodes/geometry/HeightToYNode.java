package cz.xrosecky.terratinker.nodes.geometry;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import org.json.JSONObject;

public class HeightToYNode extends AbstractNode {

    public HeightToYNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Float value = inputs.get("height").getFloatValue();

            if (value == null) {
                output.addValue("y", new NullType());
                return;
            }

            output.addValue("y", new FloatType(tree.info().coordsTranslator.heightToY(value)));
        });
    }
}
