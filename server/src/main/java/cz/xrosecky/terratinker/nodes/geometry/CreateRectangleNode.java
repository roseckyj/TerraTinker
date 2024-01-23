package cz.xrosecky.terratinker.nodes.geometry;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.GeometryType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import cz.xrosecky.terratinker.types.Geometry;
import org.json.JSONObject;

public class CreateRectangleNode extends AbstractNode {

    public CreateRectangleNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Float x1 = inputs.get("x1").getFloatValue();
            Float z1 = inputs.get("z1").getFloatValue();
            Float x2 = inputs.get("x2").getFloatValue();
            Float z2 = inputs.get("z2").getFloatValue();

            if (x1 == null || z1 == null || x2 == null || z2 == null) {
                output.addValue("output", new NullType());
                return;
            }

            Vector2D min = new Vector2D(Math.min(x1, x2), Math.min(z1, z2));
            Vector2D max = new Vector2D(Math.max(x1, x2), Math.max(z1, z2));

            output.addValue("output", new GeometryType(Geometry.rectangle(min, max)));
        });
    }
}
