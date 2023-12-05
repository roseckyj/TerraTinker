package cz.xrosecky.terratinker.nodes.raster;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.BooleanType;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import cz.xrosecky.terratinker.nodes.geometry.RasterizeNode;
import cz.xrosecky.terratinker.nodes.number.ComparisonNode;
import cz.xrosecky.terratinker.types.Geometry;
import cz.xrosecky.terratinker.types.Raster;
import org.json.JSONObject;

import java.awt.*;
import java.util.HashMap;
import java.util.Map;

public class AggregateRasterNode extends AbstractNode {
    boolean bilinear = false;

    public AggregateRasterNode(String id, JSONObject json) {
        super(id, json);

        JSONObject nodeData = json.getJSONObject("nodeData");
        String interpolation = nodeData.getString("interpolation");
        if (interpolation.equals("bilinear")) {
            bilinear = true;
        }
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Raster raster = inputs.get("raster").getRasterValue();
            Geometry geometry = inputs.get("geometry").getGeometryValue();

            if (raster == null || geometry == null) {
                output.addValue("min", new NullType());
                output.addValue("max", new NullType());
                output.addValue("average", new NullType());
                output.addValue("minY", new NullType());
                output.addValue("maxY", new NullType());
                output.addValue("averageY", new NullType());
                return;
            }

            // Detect if two geometries overlap
            RasterizeNode.RasterizeOutput rasterized = RasterizeNode.rasterize(geometry, true, 0f, 1f);
            float min = Float.MAX_VALUE;
            float max = Float.MIN_VALUE;
            float sum = 0;
            int count = 0;

            for (int x = 0; x < rasterized.image.getWidth(); x++) {
                for (int y = 0; y < rasterized.image.getHeight(); y++) {
                    if (rasterized.image.getRGB(x, y) == Color.WHITE.getRGB()) {
                        // Find the same point in B
                        Vector2D point = new Vector2D(x, y);
                        Vector2D xz = point.add(rasterized.minBoundary);
                        Vector2D latLon = tree.info().coordsTranslator.XZToLatLon(xz);

                        Float value = raster.getPixelValue((float)latLon.lat(), (float)latLon.lon(), bilinear);
                        if (value == null) {
                            continue;
                        }
                        min = Math.min(min, value);
                        max = Math.max(max, value);
                        sum += value;
                        count++;
                    }
                }
            }

            if (count == 0) {
                output.addValue("min", new NullType());
                output.addValue("max", new NullType());
                output.addValue("average", new NullType());
                output.addValue("minY", new NullType());
                output.addValue("maxY", new NullType());
                output.addValue("averageY", new NullType());
                return;
            }

            output.addValue("min", new FloatType(min));
            output.addValue("max", new FloatType(max));
            output.addValue("average", new FloatType(sum / count));
            output.addValue("minY", new FloatType((float)tree.info().coordsTranslator.altToY(min)));
            output.addValue("maxY", new FloatType((float)tree.info().coordsTranslator.altToY(max)));
            output.addValue("averageY", new FloatType((float)tree.info().coordsTranslator.altToY(sum / count)));
        });
    }
}
