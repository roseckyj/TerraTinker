package cz.xrosecky.terratinker.nodes.loaders;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.*;
import cz.xrosecky.terratinker.geometry.CoordsTranslator;
import cz.xrosecky.terratinker.geometry.Ring;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.nodes.AbstractForkNode;
import cz.xrosecky.terratinker.types.Geometry;
import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class OsmLoaderNode extends AbstractForkNode {

    private final List<OsmRequest> requests;
    private final List<String> attributes;
    private List<OsmFeature> features;

    private int index = 0;

    public OsmLoaderNode(String id, JSONObject json) {
        super(id, json);

        JSONObject nodeData = json.getJSONObject("nodeData");
        JSONArray requests = nodeData.getJSONArray("requests");

        this.requests = new ArrayList<>();
        for (var i = 0; i < requests.length(); i++) {
            this.requests.add(new OsmRequest(requests.getJSONObject(i)));
        }

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

            OsmFeature feature = features.get(index);

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
    public void setup(HashMap<String, AbstractType> inputs, EvaluationState tree) {
        // Reset the iterator
        index = 0;

        // Clear the features
        features = new ArrayList<>();

        // Create local hashmap of features
        HashMap<String, OsmFeature> features = new HashMap<>();

        try {
            // Request the OSM data
            CoordsTranslator translator = tree.info().coordsTranslator;
            Vector2D minLocation = new Vector2D(tree.info().size).scale(-0.5f);
            Vector2D maxLocation = new Vector2D(tree.info().size).scale(0.5f);

            String area = translator.CornersToGeom(translator.XZToLatLon(minLocation), translator.XZToLatLon(maxLocation));

            String body = getRequestBody(area);

            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI("https://overpass-api.de/api/interpreter"))
                    .POST(HttpRequest.BodyPublishers.ofString("data=" + URLEncoder.encode(
                            body
                            , StandardCharsets.UTF_8)))
                    .headers("Content-Type", "application/x-www-form-urlencoded")
                    .build();
            HttpResponse<InputStream> response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());

            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(response.body());

            // Parse the nodes
            var root = doc.getDocumentElement();
            var nodes = ProcessNodes(root.getElementsByTagName("node"), tree.info().coordsTranslator);

            // Parse the ways
            var wayNodes = root.getElementsByTagName("way");
            var waysLength = wayNodes.getLength();
            for (var i = 0; i < waysLength; i++) {
                if (wayNodes.item(i) instanceof Element element) {
                    var points = ProcessWay(element, nodes);
                    List<Ring> rings = new ArrayList<>();
                    rings.add(new Ring(points, Ring.RingType.OUTER));
                    Map<String, String> tags = ProcessTags(element);

                    features.put(element.getAttribute("id"), new OsmFeature(element.getAttribute("id"), tags, new Geometry(rings)));
                }
            }

            // Parse the relations
            var relations = root.getElementsByTagName("relation");
            var relationsLength = relations.getLength();
            for (var i = 0; i < relationsLength; i++) {
                if (relations.item(i) instanceof Element element) {
                    var rings = ProcessRelation(element, features);
                    Map<String, String> tags = ProcessTags(element);

                    features.put(element.getAttribute("id"), new OsmFeature(element.getAttribute("id"), tags, new Geometry(rings)));
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        // Convert the features to the output
        this.features = new ArrayList<>(features.values());
    }

    @Override
    public void teardown() {
        index = 0;
        features = new ArrayList<>();
    }

    @NotNull
    private String getRequestBody(String area) {
        StringBuilder osmRequest = new StringBuilder();
        osmRequest.append("(\n");

        for (OsmRequest request : requests) {
            if (request.node) {
                osmRequest.append(String.format("  node[%s](%s);\n", request.query, area));
            }
            if (request.way) {
                osmRequest.append(String.format("  way[%s](%s);\n", request.query, area));
            }
            if (request.relation) {
                osmRequest.append(String.format("  relation[%s](%s);\n", request.query, area));
            }
        }

        osmRequest.append(");\n");
        osmRequest.append("(._;>;);\n");
        osmRequest.append("out geom;");

        return osmRequest.toString();
    }

    // Private classes

    private static class OsmRequest {
        public String query;
        public boolean node;
        public boolean way;
        public boolean relation;

        public OsmRequest(String query, boolean node, boolean way, boolean relation) {
            this.query = query;
            this.node = node;
            this.way = way;
            this.relation = relation;
        }

        public OsmRequest(JSONObject json) {
            this(json.getString("query"), json.getBoolean("node"), json.getBoolean("way"), json.getBoolean("relation"));
        }
    }

    private static class OsmFeature {
        public String id;
        public Map<String, String> tags;
        public Geometry geometry;

        public OsmFeature(String id, Map<String, String> tags, Geometry geometry) {
            this.id = id;
            this.tags = tags;
            this.geometry = geometry;
        }
    }

    // Preprocessing of the OSM file

    private HashMap<String, Vector2D> ProcessNodes(NodeList allNodesRaw, CoordsTranslator translator) {
        var allNodes = new HashMap<String, Vector2D>();
        var length = allNodesRaw.getLength();
        for (int k = 0; k < length; k++) {
            if (allNodesRaw.item(k) instanceof Element foundNode) {
                float lat = Float.parseFloat(foundNode.getAttribute("lat"));
                float lon = Float.parseFloat(foundNode.getAttribute("lon"));

                allNodes.put(foundNode.getAttribute("id"), translator.latLonToXZ(new Vector2D(lat, lon)));
            }
        }
        return allNodes;
    }

    private List<Ring> ProcessRelation(Element relation, Map<String, OsmFeature> features) {
        List<Ring> rings = new ArrayList<>();

        var members = relation.getElementsByTagName("member");
        var length = members.getLength();
        for (var j = 0; j < length; j++) {
            if (members.item(j) instanceof Element member) {
                var feature = features.get(member.getAttribute("ref"));
                if (feature != null) {
                    feature.geometry.rings.forEach((ring) -> rings.add(new Ring(ring.points, member.getAttribute("role").equals("inner") ? Ring.RingType.INNER : Ring.RingType.OUTER)));
                }
            }
        }

        List<Ring> finalRings = new ArrayList<>();

        while (!rings.isEmpty()) {
            Ring ring = rings.get(0);
            rings.remove(0);

            List<Vector2D> points = new ArrayList<>(ring.points);

            while (points.get(0) != points.get(points.size() - 1)) {
                Stream<Ring> cont = rings.stream()
                        .filter((ring1) ->
                                ring1.type == ring.type && (
                                        ring1.points.get(0) == points.get(points.size() - 1) ||
                                                ring1.points.get(ring1.points.size() - 1) == points.get(points.size() - 1)
                                ));

                Optional<Ring> foundOpt = cont.findFirst();
                if (foundOpt.isPresent()) {
                    Ring found = foundOpt.get();

                    if (found.points.get(0) == points.get(points.size() - 1)) {
                        points.addAll(found.points.subList(1, found.points.size()));
                    } else {
                        Collections.reverse(found.points);
                        points.addAll(found.points.subList(1, found.points.size()));
                    }

                    rings.remove(found);
                } else {
                    break;
                }
            }

            finalRings.add(new Ring(points, ring.type));
        }

        return finalRings;
    }

    private List<Vector2D> ProcessWay(Element way, HashMap<String, Vector2D> nodes) {
        var points = new ArrayList<Vector2D>();
        var wayNodes = way.getElementsByTagName("nd");
        var length = wayNodes.getLength();
        for (var j = 0; j < length; j++) {
            if (wayNodes.item(j) instanceof Element wayElement) {
                points.add(nodes.get(wayElement.getAttribute("ref")));
            }
        }
        return points;
    }

    private Map<String, String> ProcessTags(Element element) {
        Map<String, String> tags = new HashMap<>();

        var tagElements = element.getElementsByTagName("tag");
        var length = tagElements.getLength();
        for (var j = 0; j < length; j++) {
            if (tagElements.item(j) instanceof Element tagsElement) {
                tags.put(tagsElement.getAttribute("k"), tagsElement.getAttribute("v"));
            }
        }

        return tags;
    }
}
