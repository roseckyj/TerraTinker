package cz.xrosecky.terratinker.nodes.loaders;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.evaluation.outputType.RasterType;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import cz.xrosecky.terratinker.types.Raster;
import cz.xrosecky.terratinker.utils.Downloader;
import cz.xrosecky.terratinker.utils.FileUtils;
import org.json.JSONObject;

import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;

public class GeoTiffLoaderNode extends AbstractNode {
    private HashMap<String, Raster> cache = new HashMap<>();

    public GeoTiffLoaderNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            String path = inputs.get("path").getStringValue();

            if (path == null) {
                output.addValue("raster", new NullType());
                return;
            }

            if (cache.containsKey(path)) {
                output.addValue("raster", new RasterType(cache.get(path)));
                return;
            }

            File file = FileUtils.pathToFile(path, tree.info().plugin.getDataFolder());

            if (file == null || !file.exists()) {
                output.addValue("raster", new NullType());
                tree.info().plugin.getLogger().warning("Could not find file " + path);
                cache.put(path, null);
                return;
            }

            Raster raster;

            try {
                raster = new Raster(file);
            } catch (Exception e) {
                output.addValue("raster", new NullType());
                cache.put(path, null);
                return;
            }

            if (raster.getRaster() == null) {
                output.addValue("raster", new NullType());
                cache.put(path, null);
                return;
            }

            cache.put(path, raster);
            output.addValue("raster", new RasterType(raster));
        });
    }
}
