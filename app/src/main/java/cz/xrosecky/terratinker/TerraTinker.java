package cz.xrosecky.terratinker;

import com.onarandombox.MultiverseCore.MultiverseCore;
import cz.xrosecky.terratinker.server.Server;
import io.javalin.Javalin;
import io.javalin.plugin.bundled.CorsPluginConfig;
import org.bukkit.plugin.java.JavaPlugin;
import org.gdal.gdal.gdal;

public final class TerraTinker extends JavaPlugin {
    private Server server;

    @Override
    public void onEnable() {
        // Start the web server
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        Thread.currentThread().setContextClassLoader(getClassLoader());
        server = new Server(this, 7070);
        Thread.currentThread().setContextClassLoader(classLoader);

        // Setup a plugin folder
        getDataFolder().mkdirs();

        // Register gdal native library
        gdal.AllRegister();
    }

    @Override
    public void onDisable() {
        if (server != null) server.stop();
    }
}
