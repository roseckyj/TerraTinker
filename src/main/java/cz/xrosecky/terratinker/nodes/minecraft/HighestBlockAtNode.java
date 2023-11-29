package cz.xrosecky.terratinker.nodes.minecraft;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.FloatType;
import cz.xrosecky.terratinker.evaluation.outputType.MaterialType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import org.bukkit.Material;
import org.bukkit.World;
import org.bukkit.block.Block;
import org.json.JSONObject;

public class HighestBlockAtNode extends AbstractNode {

    public HighestBlockAtNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            Float xF = inputs.get("x").getFloatValue();
            Float zF = inputs.get("z").getFloatValue();
            World world = tree.info().world;

            if (xF == null || zF == null) {
                return;
            }

            int x = xF.intValue();
            int z = zF.intValue();

            Block block = world.getHighestBlockAt(x, z);

            if (block.isEmpty()) {
                output.addValue("y", new FloatType((float) tree.info().world.getMinHeight()));
                output.addValue("material", new NullType());
                return;
            }

            output.addValue("y", new FloatType((float) block.getY()));
            output.addValue("material", new MaterialType(block.getType()));
        });
    }
}
