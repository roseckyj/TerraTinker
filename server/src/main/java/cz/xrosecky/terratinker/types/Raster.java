package cz.xrosecky.terratinker.types;

import cz.xrosecky.terratinker.geometry.CoordsTranslator;
import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.geometry.Vector2DInt;
import org.gdal.gdal.Band;
import org.gdal.gdal.Dataset;
import org.gdal.gdal.gdal;
import org.gdal.gdalconst.gdalconst;
import org.gdal.osr.CoordinateTransformation;
import org.gdal.osr.SpatialReference;

import java.io.File;
import java.util.Arrays;

public class Raster {
    private final Dataset dataset;
    private double[] extremes = null;
    private CoordinateTransformation ct = null;
    private CoordinateTransformation ctReverse = null;

    public Raster() {
        this.dataset = null;
    }

    public Raster(File file) {
        Dataset dataset = gdal.Open(file.getAbsolutePath(), gdalconst.GA_ReadOnly);

        if (dataset == null) {
            throw new RuntimeException("Could not open raster file " + file.getName());
        }
        this.dataset = dataset;

        calculateRasterInfo();
    }

    public Raster(Dataset dataset) {
        this.dataset = dataset;

        calculateRasterInfo();
    }

    private void calculateRasterInfo() {
        if (dataset == null) {
            ct = null;
            ctReverse = null;
            extremes = new double[]{0, 0};
            return;
        }

        String projection = dataset.GetProjection();
        SpatialReference src = new SpatialReference();
        src.SetWellKnownGeogCS("WGS84");
        SpatialReference dst = new SpatialReference(projection);
        ct = new CoordinateTransformation(src, dst);
        ctReverse = new CoordinateTransformation(dst, src);

        extremes = new double[2];
        getRasterBand().ComputeRasterMinMax(extremes);
    }

    public static Raster emptyRaster() {
        return new Raster();
    }

    public double[] getExtremes() {
        if (dataset == null)
            return new double[]{0, 0};

        return extremes;
    }

    public Geometry getGeometry(CoordsTranslator translator) {
        // Find lat/lon for corners of the raster

        Vector2DInt size = new Vector2DInt(dataset.getRasterXSize(), dataset.getRasterYSize());
        Vector2DInt[] corners = new Vector2DInt[]{
                new Vector2DInt(0, 0),
                new Vector2DInt(size.x, 0),
                new Vector2DInt(size.x, size.z),
                new Vector2DInt(0, size.z)
        };

        Vector2D[] latLonCorners = new Vector2D[4];
        for (int i = 0; i < 4; i++) {
            latLonCorners[i] = texelToLatLon(new Vector2D(corners[i].x, corners[i].z));
        }

        // Transform lat/lon to x/z
        Vector2D[] corners2D = new Vector2D[4];
        for (int i = 0; i < 4; i++) {
            corners2D[i] = translator.latLonToXZ(latLonCorners[i]);
        }

        // Create geometry
        return Geometry.polygon(Arrays.stream(corners2D).toList());
    }

    public Dataset getRaster() {
        return dataset;
    }

    public Band getRasterBand() {
        if (dataset == null)
            return null;
        return dataset.GetRasterBand(1);
    }

    public Vector2D latLonToTexel(Vector2D latLon) {
        double[] xy = ct.TransformPoint(latLon.lon(), latLon.lat()); // longitude supplied first
        double[] transform = dataset.GetGeoTransform();
        double x = (((xy[0] - transform[0]) / transform[1]));
        double y = (((xy[1] - transform[3]) / transform[5]));

        return new Vector2D(x, y);
    }

    public Vector2D texelToLatLon(Vector2D texel) {
        double[] transform = dataset.GetGeoTransform();
        double x = texel.x * transform[1] + transform[0];
        double y = texel.z * transform[5] + transform[3];
        double[] xy = ctReverse.TransformPoint(x, y);

        return new Vector2D(xy[1], xy[0]);
    }

    public Float getPixelValue(float lat, float lon, boolean bilinear) {
        return getPixelValue((double)lat, (double)lon, bilinear);
    }

    public Float getPixelValue(double lat, double lon, boolean bilinear) {
        if (dataset == null)
            return null;

        Vector2D texel = latLonToTexel(new Vector2D(lat, lon));
        double x = texel.x;
        double y = texel.z;

        // Check if the point is within the raster
        if (x < 0 || x >= dataset.getRasterXSize() || y < 0 || y >= dataset.getRasterYSize())
            return null;

        // Read the pixel value
        // Note: Floatd and doubles have problems in Docker on Alpine, so using ints for now
        int[] ff = new int[4];
        getRasterBand().ReadRaster((int)Math.floor(x), (int)Math.floor(y), 2, 2, gdalconst.GDT_Int32, ff);
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
