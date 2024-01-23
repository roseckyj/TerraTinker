package cz.xrosecky.terratinker.nodes.loaders;

import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.InputMap;
import cz.xrosecky.terratinker.evaluation.outputType.AbstractType;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.utils.FileUtils;
import org.gdal.ogr.DataSource;
import org.gdal.ogr.Driver;
import org.gdal.ogr.Layer;
import org.gdal.ogr.ogr;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;

public abstract class AbstractGdalLoaderNode extends AbstractGenericLoaderNode {
    DataSource dataset;
    abstract protected String getDriverName();

    public AbstractGdalLoaderNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    public void setup(InputMap inputs, EvaluationState tree) {
        super.setup(inputs, tree);

        String path = inputs.get("path").getStringValue();

        if (path == null) {
            super.teardown();
            return;
        }

        try {
            File file = FileUtils.pathToFile(path, tree.info().plugin.getDataFolder());

            Driver driver = ogr.GetDriverByName(getDriverName());
            dataset = driver.Open(file.getAbsolutePath(), 0);

            if (dataset == null) {
                throw new RuntimeException("Could not open shapefile " + file.getName());
            }

            features = new ArrayList<>();

            Layer layer = dataset.GetLayer(0);
            Vector2D min = tree.info().coordsTranslator.XZToLatLon(new Vector2D(tree.info().size).scale(-0.5f));
            Vector2D max = tree.info().coordsTranslator.XZToLatLon(new Vector2D(tree.info().size).scale(0.5f));
            layer.SetSpatialFilterRect(min.lon(), min.lat(), max.lon(), max.lat());

            org.gdal.ogr.Feature feature;
            while ((feature = layer.GetNextFeature()) != null) {
                features.add(Feature.fromGdal(feature, tree.info().coordsTranslator));
            }
        } catch (Exception e) {
            super.teardown();
            return;
        }
    }
}
