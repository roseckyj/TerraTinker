package cz.xrosecky.terratinker.server;

import org.bukkit.block.Biome;
import org.bukkit.generator.BiomeProvider;
import org.bukkit.generator.WorldInfo;

import java.util.Collections;
import java.util.List;

public class SingleBiomeProvider extends BiomeProvider {
    private final Biome biome;

    public SingleBiomeProvider(Biome paramBiome) {
        this.biome = paramBiome;
    }

    @Override
    public Biome getBiome(WorldInfo worldInfo, int x, int y, int z) {
        return this.biome;
    }

    @Override
    public List<Biome> getBiomes(WorldInfo worldInfo) {
        return Collections.singletonList(this.biome);
    }
}