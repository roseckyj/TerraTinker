package cz.xrosecky.terratinker;

import org.bukkit.plugin.java.JavaPlugin;

public final class TerraTinker extends JavaPlugin {

    @Override
    public void onEnable() {
        // Plugin startup logic

        getLogger().info("=== PLUGIN STARTED ===");
    }

    @Override
    public void onDisable() {
        // Plugin shutdown logic
    }
}
