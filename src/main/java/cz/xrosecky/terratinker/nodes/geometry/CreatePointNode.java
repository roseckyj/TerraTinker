package cz.xrosecky.terratinker.nodes.geometry;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.evaluation.outputType.GeometryType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import cz.xrosecky.terratinker.types.Geometry;
import org.json.JSONObject;

public class CreatePointNode extends AbstractNode {

    public CreatePointNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Float x = inputs.get("x").getFloatValue();
            Float z = inputs.get("z").getFloatValue();

            if (x == null || z == null) {
                output.addValue("output", new NullType());
                return;
            }

            output.addValue("output", new GeometryType(Geometry.point(new Vector2D(x, z))));
        });
    }
}
