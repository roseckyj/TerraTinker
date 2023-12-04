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

public class BoundingBoxNode extends AbstractNode {

    public BoundingBoxNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Geometry geometry = inputs.get("input").getGeometryValue();

            if (geometry == null) {
                output.addValue("geometry", new NullType());
                output.addValue("minX", new NullType());
                output.addValue("maxX", new NullType());
                output.addValue("width", new NullType());
                output.addValue("minZ", new NullType());
                output.addValue("maxZ", new NullType());
                output.addValue("height", new NullType());
                return;
            }

            Vector2D minBoundary = geometry.minBoundary;
            Vector2D maxBoundary = geometry.maxBoundary;

            output.addValue("geometry", new GeometryType(Geometry.rectangle(minBoundary, maxBoundary)));
            output.addValue("minX", new FloatType(minBoundary.x));
            output.addValue("maxX", new FloatType(maxBoundary.x));
            output.addValue("width", new FloatType(maxBoundary.x - minBoundary.x));
            output.addValue("minZ", new FloatType(minBoundary.z));
            output.addValue("maxZ", new FloatType(maxBoundary.z));
            output.addValue("height", new FloatType(maxBoundary.z - minBoundary.z));
        });
    }
}
