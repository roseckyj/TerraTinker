package cz.xrosecky.terratinker.types;

import cz.xrosecky.terratinker.geometry.CoordsTranslator;
import cz.xrosecky.terratinker.geometry.Ring;
import cz.xrosecky.terratinker.geometry.Vector2D;
import org.gdal.ogr.Feature;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Geometry {
    public final List<Ring> rings;
    public final Vector2D minBoundary;
    public final Vector2D maxBoundary;

    public Geometry(List<Ring> rings) {
        this.rings = rings;

        if (rings.isEmpty()) {
            minBoundary = new Vector2D(0, 0);
            maxBoundary = new Vector2D(0, 0);
            return;
        }

        int minX = Integer.MAX_VALUE;
        int minY = Integer.MAX_VALUE;
        int maxX = Integer.MIN_VALUE;
        int maxY = Integer.MIN_VALUE;

        for (var ring : rings) {
            var points = ring.points;

            for (Vector2D vector2D : points) {
                minX = (int) Math.floor(Math.min(minX, vector2D.x));
                minY = (int) Math.floor(Math.min(minY, vector2D.z));
                maxX = (int) Math.ceil(Math.max(maxX, vector2D.x));
                maxY = (int) Math.ceil(Math.max(maxY, vector2D.z));
            }
        }

        minBoundary = new Vector2D(minX, minY);
        maxBoundary = new Vector2D(maxX, maxY);
    }

    public Geometry() {
        this.rings = new ArrayList<>();
        this.minBoundary = new Vector2D(0, 0);
        this.maxBoundary = new Vector2D(0, 0);
    }

    public static Geometry emptyGeometry() {
        return new Geometry();
    }

    public static Geometry fromGdal(Feature feature, CoordsTranslator translator) {
        List<Ring> rings = new ArrayList<>();
        org.gdal.ogr.Geometry geom = feature.GetGeometryRef();
        if (geom.GetGeometryCount() < 1 && geom.GetPointCount() > 0) {
            List<Vector2D> points = new ArrayList<>();

            for (int j = 0; j < geom.GetPointCount(); j++) {
                double[] point = geom.GetPoint(j);
                points.add(translator.latLonToXZ(new Vector2D(point[1], point[0])));
            }

            rings.add(new Ring(points, Ring.RingType.OUTER));
            return new Geometry(rings);
        }

        for (int i = 0; i < geom.GetGeometryCount(); i++) {
            org.gdal.ogr.Geometry subGeom = geom.GetGeometryRef(i);
            Ring.RingType type = Ring.RingType.OUTER;

            if (i > 0) {
                type = Ring.RingType.INNER;
            }

            List<Vector2D> points = new ArrayList<>();

            for (int j = 0; j < subGeom.GetPointCount(); j++) {
                double[] point = subGeom.GetPoint(j);
                points.add(translator.latLonToXZ(new Vector2D(point[1], point[0])));
            }

            rings.add(new Ring(points, type));
        }

        return new Geometry(rings);
    }

    public static Geometry rectangle(Vector2D min, Vector2D max) {
        List<Ring> rings = new ArrayList<>();
        List<Vector2D> points = new ArrayList<>();
        points.add(min);
        points.add(new Vector2D(min.x, max.z));
        points.add(max);
        points.add(new Vector2D(max.x, min.z));
        points.add(min);
        rings.add(new Ring(points, Ring.RingType.OUTER));
        return new Geometry(rings);
    }

    public static Geometry point(Vector2D point) {
        List<Ring> rings = new ArrayList<>();
        List<Vector2D> points = new ArrayList<>();
        points.add(point);
        rings.add(new Ring(points, Ring.RingType.OUTER));
        return new Geometry(rings);
    }

    public static Geometry polygon(List<Vector2D> points) {
        List<Ring> rings = new ArrayList<>();
        rings.add(new Ring(points, Ring.RingType.OUTER));
        return new Geometry(rings);
    }
}
