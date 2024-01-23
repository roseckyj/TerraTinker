package cz.xrosecky.terratinker.nodes.loaders;

import org.json.JSONObject;

public class GeoJsonLoaderNode extends AbstractGdalLoaderNode {
    public GeoJsonLoaderNode(String id, JSONObject json) {
        super(id, json);
    }

    @Override
    protected String getDriverName() {
        return "GeoJSON";
    }
}
