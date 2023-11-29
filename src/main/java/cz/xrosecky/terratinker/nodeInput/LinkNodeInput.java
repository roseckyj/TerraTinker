package cz.xrosecky.terratinker.nodeInput;

public class LinkNodeInput extends AbstractNodeInput {
    public String nodeId;
    public String outputId;

    public LinkNodeInput(String nodeId, String outputId) {
        this.nodeId = nodeId;
        this.outputId = outputId;
    }
}
