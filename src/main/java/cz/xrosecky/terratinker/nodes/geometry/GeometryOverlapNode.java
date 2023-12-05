package cz.xrosecky.terratinker.nodes.geometry;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.BooleanType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import cz.xrosecky.terratinker.types.Geometry;
import org.json.JSONObject;

import java.awt.*;

public class GeometryOverlapNode extends AbstractNode {

    public GeometryOverlapNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Geometry a = inputs.get("a").getGeometryValue();
            Geometry b = inputs.get("b").getGeometryValue();

            if (a == null || b == null) {
                output.addValue("output", new NullType());
                return;
            }

            // Detect if two geometries overlap
            boolean overlap = false;

            RasterizeNode.RasterizeOutput rasterizedA = RasterizeNode.rasterize(a, true, 0f, 1f);
            RasterizeNode.RasterizeOutput rasterizedB = RasterizeNode.rasterize(b, true, 0f, 1f);

            for (int x = 0; x < rasterizedA.image.getWidth(); x++) {
                for (int y = 0; y < rasterizedA.image.getHeight(); y++) {
                    if (rasterizedA.image.getRGB(x, y) == Color.WHITE.getRGB()) {
                        // Find the same point in B
                        Vector2D point = new Vector2D(x, y);
                        Vector2D pointInB = point.add(rasterizedA.minBoundary).subtract(rasterizedB.minBoundary);

                        if (pointInB.x < 0 || pointInB.z < 0 || pointInB.x >= rasterizedB.image.getWidth() || pointInB.z >= rasterizedB.image.getHeight()) {
                            continue;
                        }

                        if (rasterizedB.image.getRGB((int)pointInB.x, (int)pointInB.z) == Color.WHITE.getRGB()) {
                            output.addValue("output", new BooleanType(true));
                            return;
                        }
                    }
                }
            }

            output.addValue("output", new BooleanType(false));
        });
    }
}
