package cz.xrosecky.terratinker.nodes.minecraft;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.nodes.AbstractActionNode;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.TreeType;
import org.bukkit.World;
import org.json.JSONObject;

public class PlaceTreeNode extends AbstractActionNode {
    private final TreeType treeType;

    public PlaceTreeNode(String id, JSONObject json) {
        super(id, json);

        JSONObject nodeData = json.getJSONObject("nodeData");
        String treeTypeString = nodeData.getString("treeType");
        treeTypeString = treeTypeString.toUpperCase().replaceAll(" ", "_");
        treeType = TreeType.valueOf(treeTypeString);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.actionRoutine(program, tree, (inputs, output) -> {
            Float xF = inputs.get("x").getFloatValue();
            Float yF = inputs.get("y").getFloatValue();
            Float zF = inputs.get("z").getFloatValue();
            World world = tree.info().world;

            if (xF == null || yF == null || zF == null) {
                return;
            }

            int x = xF.intValue();
            int y = yF.intValue();
            int z = zF.intValue();

            world.generateTree(new Location(world, x, y, z), treeType);
        });
    }
}
