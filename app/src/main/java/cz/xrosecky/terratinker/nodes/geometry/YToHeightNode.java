package cz.xrosecky.terratinker.nodes.geometry;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import org.json.JSONObject;

public class YToHeightNode extends AbstractNode {

    public YToHeightNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Float value = inputs.get("y").getFloatValue();

            if (value == null) {
                output.addValue("height", new NullType());
                return;
            }

            output.addValue("height", new FloatType(tree.info().coordsTranslator.yToHeight(value)));
        });
    }
}
