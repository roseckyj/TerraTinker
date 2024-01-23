package cz.xrosecky.terratinker.utils;

import cz.xrosecky.terratinker.evaluation.outputType.NullType;

import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;

public class FileUtils {
    public static File pathToFile(String path, File dataFolder) {
        if (path == null) {
            return null;
        }

        File file;

        if (path.startsWith("http")) {
            try {
                file = Downloader.downloadFile(new URI(path), dataFolder);
            } catch (URISyntaxException e) {
                return null;
            }
        } else {
            file = new File(dataFolder, path);
        }
        return file;
    }
}
