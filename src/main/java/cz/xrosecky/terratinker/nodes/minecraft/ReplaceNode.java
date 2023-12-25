package cz.xrosecky.terratinker.nodes.minecraft;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.nodes.AbstractActionNode;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import org.bukkit.Material;
import org.bukkit.World;
import org.json.JSONObject;

public class ReplaceNode extends AbstractActionNode {

    public ReplaceNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.actionRoutine(program, tree, (inputs, output) -> {
            Float minXF = inputs.get("minX").getFloatValue();
            Float minYF = inputs.get("minY").getFloatValue();
            Float minZF = inputs.get("minZ").getFloatValue();
            Float maxXF = inputs.get("maxX").getFloatValue();
            Float maxYF = inputs.get("maxY").getFloatValue();
            Float maxZF = inputs.get("maxZ").getFloatValue();
            Material source = inputs.get("source").getMaterialValue();
            Material target = inputs.get("target").getMaterialValue();
            World world = tree.info().world;

            if (minXF == null || minYF == null || minZF == null || maxXF == null || maxYF == null || maxZF == null || source == null || target == null) {
                return;
            }

            int minX = Math.min(minXF.intValue(), maxXF.intValue());
            int minY = Math.min(minYF.intValue(), maxYF.intValue());
            int minZ = Math.min(minZF.intValue(), maxZF.intValue());
            int maxX = Math.max(minXF.intValue(), maxXF.intValue());
            int maxY = Math.max(minYF.intValue(), maxYF.intValue());
            int maxZ = Math.max(minZF.intValue(), maxZF.intValue());

            for (int x = minX; x <= maxX; x++) {
                for (int y = minY; y <= maxY; y++) {
                    for (int z = minZ; z <= maxZ; z++) {
                        if (world.getType(x + tree.info().origin.x, y + tree.info().origin.y, z + tree.info().origin.z) == source) {
                            world.setType(x + tree.info().origin.x, y + tree.info().origin.y, z + tree.info().origin.z, target);
                        }
                    }
                }
            }
        });
    }
}
