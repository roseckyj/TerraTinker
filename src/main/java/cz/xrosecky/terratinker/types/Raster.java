package cz.xrosecky.terratinker.types;

import kotlin.Pair;
import org.gdal.gdal.Band;
import org.gdal.gdal.Dataset;
import org.gdal.gdal.gdal;
import org.gdal.osr.CoordinateTransformation;
import org.gdal.osr.SpatialReference;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;

public class Raster {
    private final Dataset dataset;

    public Raster() {
        this.dataset = null;
    }

    public Raster(File file) {
        this.dataset = gdal.Open(file.getAbsolutePath());
        if (this.dataset == null) {
            throw new RuntimeException("Could not open raster file " + file.getName());
        }
    }

    public Raster(Dataset dataset) {
        this.dataset = dataset;
    }

    public static Raster emptyRaster() {
        return new Raster();
    }

    public double[] getExtremes() {
        if (dataset == null)
            return new double[]{0, 0};

        double[] extremes = new double[2];
        getRasterBand().ComputeRasterMinMax(extremes);
        return extremes;
    }

    public Geometry getGeometry() {
        // TODO: implement
        return Geometry.emptyGeometry();
    }

    public Dataset getRaster() {
        return dataset;
    }

    public Band getRasterBand() {
        if (dataset == null)
            return null;
        return dataset.GetRasterBand(1);
    }

    public Float getPixelValue(float lat, float lon, boolean bilinear) {
        return getPixelValue((double)lat, (double)lon, bilinear);
    }

    public Float getPixelValue(double lat, double lon, boolean bilinear) {
        if (dataset == null)
            return null;

        // Apply coordinate transformation
        String projection = dataset.GetProjection();
        SpatialReference src = new SpatialReference();
        src.SetWellKnownGeogCS("WGS84");
        SpatialReference dst = new SpatialReference(projection);
        CoordinateTransformation ct = new CoordinateTransformation(src, dst);
        double[] xy = ct.TransformPoint(lon, lat); // longitude supplied first
        double[] transform = dataset.GetGeoTransform();
        double x = (((xy[0] - transform[0]) / transform[1]));
        double y = (((xy[1] - transform[3]) / transform[5]));

        // Check if the point is within the raster
        if (x < 0 || x >= dataset.getRasterXSize() || y < 0 || y >= dataset.getRasterYSize())
            return null;

        // Read the pixel value
        double[] ff = new double[4];
        getRasterBand().ReadRaster((int)Math.floor(x), (int)Math.floor(y), 2, 2, ff);
        if (bilinear) {
            double x1 = x - Math.floor(x);
            double y1 = y - Math.floor(y);
            double x2 = 1 - x1;
            double y2 = 1 - y1;
            return (float)((ff[0] * x2 + ff[1] * x1) * y2 + (ff[2] * x2 + ff[3] * x1) * y1);
        } else {
            return (float)ff[0];
        }
    }
}
