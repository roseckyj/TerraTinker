package cz.xrosecky.terratinker.nodes.geometry;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.evaluation.outputType.GeometryType;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import cz.xrosecky.terratinker.types.Geometry;
import org.json.JSONObject;

public class SelectedRegionNode extends AbstractNode {

    public SelectedRegionNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            output.addValue("geometry", new GeometryType(Geometry.rectangle(
                    new Vector2D((float)-tree.info().size.x / 2, (float)-tree.info().size.z / 2),
                    new Vector2D((float)tree.info().size.x / 2, (float)tree.info().size.z / 2)
            )));
            output.addValue("minX", new FloatType((float)-tree.info().size.x / 2));
            output.addValue("maxX", new FloatType((float)tree.info().size.x / 2));
            output.addValue("minZ", new FloatType((float)-tree.info().size.z / 2));
            output.addValue("maxZ", new FloatType((float)tree.info().size.z / 2));
            output.addValue("width", new FloatType((float)tree.info().size.x));
            output.addValue("height", new FloatType((float)tree.info().size.z));
            output.addValue("minAltitude", new FloatType(tree.info().minAltitude));
            output.addValue("horizontalScale", new FloatType(tree.info().coordsTranslator.xzScale));
            output.addValue("verticalScale", new FloatType(tree.info().coordsTranslator.yScale));
        });
    }
}
