package cz.xrosecky.terratinker.nodes.loaders;

import cz.xrosecky.terratinker.Program;
import cz.xrosecky.terratinker.evaluation.EvaluationState;
import cz.xrosecky.terratinker.evaluation.outputType.NullType;
import cz.xrosecky.terratinker.evaluation.outputType.StringType;
import cz.xrosecky.terratinker.nodes.AbstractNode;
import cz.xrosecky.terratinker.nodes.number.MathNode;
import org.apache.commons.io.FileUtils;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;

public class LocalFileNode extends AbstractNode {
    private final String fileId;

    public LocalFileNode(String id, JSONObject json) {
        super(id, json);

        this.fileId = json.getJSONObject("nodeData").getString("fileId");
    }

    @Override
    public AbstractNode evaluate(Program program, EvaluationState tree) {
        return super.evaluationRoutine(program, tree, (inputs, output) -> {
            File file = cz.xrosecky.terratinker.utils.FileUtils.pathToFile(fileId + ".meta", tree.info().plugin.getDataFolder());

            if (!file.exists()) {
                output.addValue("path", new NullType());
                return;
            }

            JSONObject meta;
            try {
                meta = new JSONObject(FileUtils.readFileToString(file, "UTF-8"));
            } catch (IOException e) {
                output.addValue("path", new NullType());
                return;
            }

            output.addValue("path", new StringType(meta.getString("filename")));
        });
    }
}
