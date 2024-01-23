package cz.xrosecky.terratinker.nodes.minecraft;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.nodes.AbstractActionNode;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import org.bukkit.Material;
import org.bukkit.World;
import org.json.JSONObject;

public class SetBlockNode extends AbstractActionNode {

    public SetBlockNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.actionRoutine(program, tree, (inputs, output) -> {
            Float xF = inputs.get("x").getFloatValue();
            Float yF = inputs.get("y").getFloatValue();
            Float zF = inputs.get("z").getFloatValue();
            Material material = inputs.get("material").getMaterialValue();
            World world = tree.info().world;

            if (xF == null || yF == null || zF == null || material == null) {
                return;
            }

            int x = xF.intValue();
            int y = yF.intValue();
            int z = zF.intValue();

            world.setType(x + tree.info().origin.x, y + tree.info().origin.y, z + tree.info().origin.z, material);
        });
    }
}
