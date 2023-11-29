package cz.xrosecky.terratinker.nodeInput;

import cz.xrosecky.terratinker.evaluationTree.outputType.AbstractType;
import org.json.JSONObject;

public abstract class AbstractNodeInput {
    public static AbstractNodeInput createInput(JSONObject inputJson) {
        String type = inputJson.getString("kind");
        if (type.equals("link")) {
            return new LinkNodeInput(inputJson.getString("node"), inputJson.getString("output"));
        } else if (type.equals("value")) {
            return new ValueNodeInput(AbstractType.fromJson(inputJson)); // TBD
        } else {
            throw new RuntimeException("Unknown input type: " + type);
        }
    }
}
