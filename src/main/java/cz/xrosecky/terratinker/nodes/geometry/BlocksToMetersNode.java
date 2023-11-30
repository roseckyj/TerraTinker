package cz.xrosecky.terratinker.nodes.geometry;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import org.json.JSONObject;

public class BlocksToMetersNode extends AbstractNode {

    public BlocksToMetersNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Float value = inputs.get("blocks").getFloatValue();

            if (value == null) {
                output.addValue("meters", new NullType());
                return;
            }

            output.addValue("meters", new FloatType(value / tree.info().coordsTranslator.xzScale));
        });
    }
}
