package cz.xrosecky.terratinker.server;

import cz.xrosecky.terratinker.Evaluator;
import cz.xrosecky.terratinker.TerraTinker;
import org.bukkit.Difficulty;
import org.bukkit.World;
import org.bukkit.WorldCreator;
import org.bukkit.WorldType;
import org.bukkit.plugin.java.JavaPlugin;

public class Session {
    public final String id;

    private final TerraTinker plugin;
    private final Evaluator evaluator;
    private final String input;
    private World world;
    private boolean isPreview;

    public Session(TerraTinker plugin, String input, boolean isPreview) {
        this.id = java.util.UUID.randomUUID().toString();
        this.input = input;
        this.plugin = plugin;
        this.evaluator = new Evaluator(plugin, isPreview);
        this.isPreview = isPreview;
    }

    public void run() {
        plugin.getServer().getScheduler().runTask(plugin, () -> {
            // Create a new world
            WorldCreator creator = new WorldCreator(id);
            creator.type(WorldType.FLAT);
            creator.generatorSettings("{\"layers\": [{\"block\": \"air\", \"height\": 1}], \"biome\":\"plains\"}");
            creator.environment(World.Environment.NORMAL);
            creator.generateStructures(false);
            creator.generator(new VoidGen());
            world = plugin.getServer().createWorld(creator);
            if (world == null) {
                throw new RuntimeException("Could not create world");
            }
            world.setDifficulty(Difficulty.PEACEFUL);
            evaluator.evaluate(input, world);
        });
    }

    public World getWorld() {
        return world;
    }

    public boolean isRunning() {
        return evaluator.isRunning();
    }
}
