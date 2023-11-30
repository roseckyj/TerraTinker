package cz.xrosecky.terratinker.nodes.geometry;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import org.json.JSONObject;

public class MetersToBlocksNode extends AbstractNode {

    public MetersToBlocksNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Float value = inputs.get("meters").getFloatValue();

            if (value == null) {
                output.addValue("blocks", new NullType());
                return;
            }

            output.addValue("blocks", new FloatType(value * tree.info().coordsTranslator.xzScale));
        });
    }
}
