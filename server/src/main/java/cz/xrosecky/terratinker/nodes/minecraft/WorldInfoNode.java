package cz.xrosecky.terratinker.nodes.minecraft;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import org.json.JSONObject;

public class WorldInfoNode extends AbstractNode {

    public WorldInfoNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            output.addValue("minY", new FloatType((float) tree.info().world.getMinHeight()));
            output.addValue("maxY", new FloatType((float) tree.info().world.getMaxHeight() - 1));
        });
    }
}
