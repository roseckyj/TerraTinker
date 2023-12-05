package cz.xrosecky.terratinker.nodes.raster;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.evaluation.outputType.GeometryType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import cz.xrosecky.terratinker.types.Geometry;
import cz.xrosecky.terratinker.types.Raster;
import org.json.JSONObject;

public class RasterInfoNode extends AbstractNode {

    public RasterInfoNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Raster raster = inputs.get("raster").getRasterValue();

            if (raster == null) {
                output.addValue("region", new NullType());
                output.addValue("min", new NullType());
                output.addValue("max", new NullType());
                output.addValue("minY", new NullType());
                output.addValue("maxY", new NullType());
                return;
            }

            double[] extremes = raster.getExtremes();
            output.addValue("min", new FloatType((float) extremes[0]));
            output.addValue("max", new FloatType((float) extremes[1]));
            output.addValue("minY", new FloatType((float) tree.info().coordsTranslator.altToY(extremes[0])));
            output.addValue("maxY", new FloatType((float) tree.info().coordsTranslator.altToY(extremes[1])));

            Geometry region = raster.getGeometry(tree.info().coordsTranslator);
            output.addValue("region", new GeometryType(region));
        });
    }
}
