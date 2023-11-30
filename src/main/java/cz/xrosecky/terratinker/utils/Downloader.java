package cz.xrosecky.terratinker.utils;

import java.io.File;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.UUID;

public class Downloader {
    public static File downloadFile(URI url, File folder) {
        String name = url.toString();
        String extension = name.substring(name.lastIndexOf("."));

        String filename = UUID.randomUUID().toString() + "." + extension;

        try {
            HttpClient downloadClient = HttpClient.newBuilder()
                    .followRedirects(HttpClient.Redirect.ALWAYS)
                    .build();
            HttpRequest downloadRequest = HttpRequest.newBuilder()
                    .GET()
                    .uri(url)
                    .header("Accept", "application/octet-stream")
                    .build();

            HttpResponse<InputStream> downloadResponse = downloadClient.send(downloadRequest, HttpResponse.BodyHandlers.ofInputStream());

            if (downloadResponse.statusCode() != 200) {
                return null;
            }

            File tileTarget = new File(folder, filename);
            folder.mkdirs();
            Files.copy(downloadResponse.body(), tileTarget.toPath(), StandardCopyOption.REPLACE_EXISTING);

            return tileTarget;
        } catch (Exception _e) {
            return null;
        }
    }
}
