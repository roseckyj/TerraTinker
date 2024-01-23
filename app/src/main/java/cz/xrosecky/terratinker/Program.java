package cz.xrosecky.terratinker;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;

import cz.xrosecky.terratinker.nodes.AbstractNode;
import cz.xrosecky.terratinker.nodes.NodeManager;

public class Program {
    private String name;
    private String id;
    private List<String> flow;
    private Map<String, AbstractNode> nodes;

    public static Program fromJson(JSONObject json) {
        Program tree = new Program();
        tree.name = json.getString("name");
        tree.id = json.getString("id");
        tree.flow = json.getJSONObject("flow").getJSONArray("nodes").toList().stream().map(Object::toString).toList();
        tree.nodes = new HashMap<>();

        JSONObject nodes = json.getJSONObject("nodes");

        nodes.keySet().stream().forEach(key -> {
            JSONObject nodeJson = nodes.getJSONObject(key);
            tree.nodes.put(key, NodeManager.createNode(key, nodeJson));
        });

        return tree;
    }

    public AbstractNode getNode(String id) {
        return nodes.get(id);
    }

    public AbstractNode getFlowTail() {
        if (flow.isEmpty()) {
            throw new IllegalArgumentException("Flow is empty");
        }
        String tailId = flow.get(flow.size() - 1);
        AbstractNode tail = nodes.get(tailId);
        if (tail == null) {
            throw new IllegalArgumentException("Node " + tailId + " not found");
        }

        return tail;
    }

    public List<AbstractNode> getflowPrerequisities(AbstractNode node) {
        List<AbstractNode> prerequisities = new ArrayList<>();

        // Check if node is in the flow, if not, we return empty list
        if (!flow.contains(node.id)) {
            return prerequisities;
        }

        // If it does, we return all the nodes before it in reverse order
        int index = flow.indexOf(node.id);
        for (int i = index - 1; i >= 0; i--) {
            prerequisities.add(nodes.get(flow.get(i)));
        }

        return prerequisities;
    }
}
