package cz.xrosecky.terratinker.nodes.loaders;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.InputMap;
import cz.xrosecky.terratinker.evaluation.outputType.*;
import cz.xrosecky.terratinker.geometry.CoordsTranslator;
import cz.xrosecky.terratinker.geometry.Ring;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.nodes.AbstractForkNode;
import cz.xrosecky.terratinker.types.Geometry;
import cz.xrosecky.terratinker.utils.FileUtils;
import org.gdal.ogr.Driver;
import org.gdal.ogr.Layer;
import org.gdal.ogr.ogr;
import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.File;
import java.io.InputStream;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Stream;

public abstract class AbstractGenericLoaderNode extends AbstractForkNode {
    protected final List<String> attributes;
    protected List<Feature> features;

    protected int index = 0;

    public AbstractGenericLoaderNode(String id, JSONObject json) {
        super(id, json);

        JSONObject nodeData = json.getJSONObject("nodeData");

        JSONArray attributes = nodeData.getJSONArray("attributes");
        this.attributes = new ArrayList<>();
        for (var i = 0; i < attributes.length(); i++) {
            this.attributes.add(attributes.getJSONObject(i).getString("path"));
        }
    }

    @Override
    public boolean evaluateNext(Program program, EvaluationState tree) {
        return super.forkRoutine(program, tree, (inputs, output) -> {
            if (index >= features.size()) {
                return false;
            }

            Feature feature = features.get(index);

            output.addValue("geometry", new GeometryType(feature.geometry));
            output.addValue("id", new FloatType(Float.parseFloat(feature.id)));

            for (String attribute : attributes) {
                if (feature.tags.containsKey(attribute)) {
                    output.addValue(attribute, new StringType(feature.tags.get(attribute)));
                } else {
                    output.addValue(attribute, new NullType());
                }
            }

            index++;
            return true;
        });
    }

    @Override
    public void setup(InputMap inputs, EvaluationState tree) {
        // Reset the iterator
        index = 0;

        // Clear the features
        features = new ArrayList<>();
    }

    @Override
    public void teardown() {
        index = 0;
        features = new ArrayList<>();
    }

    protected static class Feature {
        public String id;
        public Map<String, String> tags;
        public Geometry geometry;

        public Feature(String id, Map<String, String> tags, Geometry geometry) {
            this.id = id;
            this.tags = tags;
            this.geometry = geometry;
        }

        public static Feature fromGdal(org.gdal.ogr.Feature feature, CoordsTranslator translator) {
            String id = feature.GetFID() + "";

            Map<String, String> tags = new HashMap<>();
            for (int i = 0; i < feature.GetFieldCount(); i++) {
                tags.put(feature.GetFieldDefnRef(i).GetName(), feature.GetFieldAsString(i));
            }

            return new Feature(id, tags, Geometry.fromGdal(feature, translator));
        }
    }
}
