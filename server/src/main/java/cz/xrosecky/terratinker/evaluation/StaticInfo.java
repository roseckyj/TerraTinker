package cz.xrosecky.terratinker.evaluation;

import cz.xrosecky.terratinker.Evaluator;
import cz.xrosecky.terratinker.geometry.CoordsTranslator;
import cz.xrosecky.terratinker.geometry.Vector2DInt;
import cz.xrosecky.terratinker.geometry.Vector3DInt;
import org.bukkit.World;
import org.bukkit.plugin.java.JavaPlugin;

public class StaticInfo {
    public final JavaPlugin plugin;
    public final World world;
    public final Evaluator evaluator;
    public final CoordsTranslator coordsTranslator;
    public final Vector2DInt size;
    public final float minAltitude;
    public final Vector3DInt origin;

    public StaticInfo(JavaPlugin plugin, World world, Evaluator evaluator, CoordsTranslator coordsTranslator, Vector2DInt size, float minAltitude, Vector3DInt origin) {
        this.plugin = plugin;
        this.world = world;
        this.evaluator = evaluator;
        this.coordsTranslator = coordsTranslator;
        this.size = size;
        this.minAltitude = minAltitude;
        this.origin = origin;
    }
}
