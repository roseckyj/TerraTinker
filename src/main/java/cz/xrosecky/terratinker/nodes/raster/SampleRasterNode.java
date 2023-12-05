package cz.xrosecky.terratinker.nodes.raster;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.evaluation.outputType.MaterialType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import cz.xrosecky.terratinker.types.Raster;
import org.bukkit.World;
import org.bukkit.block.Block;
import org.json.JSONObject;

public class SampleRasterNode extends AbstractNode {
    boolean bilinear = false;

    public SampleRasterNode(String id, JSONObject json) {
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
            Float xF = inputs.get("x").getFloatValue();
            Float zF = inputs.get("z").getFloatValue();
            Raster raster = inputs.get("raster").getRasterValue();

            if (xF == null || zF == null || raster == null) {
                return;
            }

            int x = xF.intValue();
            int z = zF.intValue();

            Vector2D latLon = tree.info().coordsTranslator.XZToLatLon(x, z);

            Float value = raster.getPixelValue((float)latLon.lat(), (float)latLon.lon(), bilinear);

            if (value == null) {
                output.addValue("y", new NullType());
                output.addValue("value", new NullType());
                return;
            }

            output.addValue("value", new FloatType(value));
            output.addValue("y", new FloatType((float)tree.info().coordsTranslator.altToY(value)));
        });
    }
}
