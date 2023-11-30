package cz.xrosecky.terratinker.nodes;

import cz.xrosecky.terratinker.nodes.geometry.AltitudeToYNode;
import cz.xrosecky.terratinker.nodes.geometry.HeightToYNode;
import cz.xrosecky.terratinker.nodes.geometry.MetersToBlocksNode;
import cz.xrosecky.terratinker.nodes.geometry.YToAltitudeNode;
import cz.xrosecky.terratinker.nodes.minecraft.*;
import cz.xrosecky.terratinker.nodes.loaders.GeoTiffLoaderNode;
import cz.xrosecky.terratinker.nodes.raster.SampleRasterNode;
import org.json.JSONObject;

import cz.xrosecky.terratinker.nodes.bool.BooleanOperatorNode;
import cz.xrosecky.terratinker.nodes.bool.NotNode;
import cz.xrosecky.terratinker.nodes.conditional.IsNullNode;
import cz.xrosecky.terratinker.nodes.conditional.NullNode;
import cz.xrosecky.terratinker.nodes.conditional.NullSwitchNode;
import cz.xrosecky.terratinker.nodes.conditional.SwitchNode;
import cz.xrosecky.terratinker.nodes.material.MaterialByName;
import cz.xrosecky.terratinker.nodes.material.MaterialScaleNode;
import cz.xrosecky.terratinker.nodes.number.ComparisonNode;
import cz.xrosecky.terratinker.nodes.number.MathNode;
import cz.xrosecky.terratinker.nodes.number.RandomNumberNode;
import cz.xrosecky.terratinker.nodes.number.SequenceNode;
import cz.xrosecky.terratinker.nodes.string.ToStringNode;

public class NodeManager {
    @SuppressWarnings("DuplicateBranchesInSwitch")
    public static AbstractNode createNode(String id, JSONObject json) {
        String type = json.getString("type");

        return switch (type) {
            // Boolean
            case "booleanOperator" -> new BooleanOperatorNode(id, json);
            case "constantBoolean" -> new ConstantNode(id, json);
            case "not" -> new NotNode(id, json);

            // Conditional
            case "forceNotNull" -> new ConstantNode(id, json);
            case "isNull" -> new IsNullNode(id, json);
            case "null" -> new NullNode(id, json);
            case "nullSwitch" -> new NullSwitchNode(id, json);
            case "switch" -> new SwitchNode(id, json);

            // Geometry
            case "altitudeToY" -> new AltitudeToYNode(id, json);
            case "yToAltitude" -> new YToAltitudeNode(id, json);
            case "heightToY" -> new HeightToYNode(id, json);
            case "yToHeight" -> new YToAltitudeNode(id, json);
            case "metersToBlocks" -> new MetersToBlocksNode(id, json);
            case "blocksToMeters" -> new MetersToBlocksNode(id, json);
            // TODO: implement

            // Loaders
            case "geoTiffLoader" -> new GeoTiffLoaderNode(id, json);

            // Material
            case "constantMaterial" -> new ConstantNode(id, json);
            case "materialByName" -> new MaterialByName(id, json);
            case "materialScale" -> new MaterialScaleNode(id, json);

            // Minecraft
            case "setBlock" -> new SetBlockNode(id, json);
            case "fill" -> new FillNode(id, json);
            case "placeTree" -> new PlaceTreeNode(id, json);
            case "replace" -> new ReplaceNode(id, json);
            case "worldInfo" -> new WorldInfoNode(id, json);
            case "highestBlockAt" -> new HighestBlockAtNode(id, json);

            // Misc
            case "comment" -> new VoidNode(id, json);
            case "log" -> new LoggingNode(id, json);

            // Number
            case "comparison" -> new ComparisonNode(id, json);
            case "constantNumber" -> new ConstantNode(id, json);
            case "math" -> new MathNode(id, json);
            case "randomNumber" -> new RandomNumberNode(id, json);
            case "sequence" -> new SequenceNode(id, json);

            // Raster
            case "sampleRaster" -> new SampleRasterNode(id, json);
            // TODO: implement

            // String
            case "constantString" -> new ConstantNode(id, json);
            case "toString" -> new ToStringNode(id, json);

            default -> throw new RuntimeException("Unknown node type: " + type);
        };
    }
}
