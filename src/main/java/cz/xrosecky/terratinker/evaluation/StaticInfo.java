package cz.xrosecky.terratinker.evaluation;

import cz.xrosecky.terratinker.geometry.CoordsTranslator;
import cz.xrosecky.terratinker.geometry.Vector2DInt;
import org.bukkit.World;
import org.bukkit.plugin.java.JavaPlugin;

public class StaticInfo {
    public final JavaPlugin plugin;
    public final World world;
    public final CoordsTranslator coordsTranslator;
    Vector2DInt size;

    public StaticInfo(JavaPlugin plugin, World world, CoordsTranslator coordsTranslator, Vector2DInt size) {
        this.plugin = plugin;
        this.world = world;
        this.coordsTranslator = coordsTranslator;
        this.size = size;
    }
}
