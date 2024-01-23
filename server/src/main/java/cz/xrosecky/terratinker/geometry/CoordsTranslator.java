package cz.xrosecky.terratinker.geometry;

// lat = NS = x = phi
// lon = WE = z = lambda

import cz.xrosecky.terratinker.geometry.Vector2D;
import cz.xrosecky.terratinker.geometry.Vector3D;

import java.util.Locale;

public class CoordsTranslator {
    private static final double EARTH_RADIUS = 6371 * 1000;
    private int altShift = 0;
    public final Vector2D mapCenter;
    public final Vector2D ingameCenter;
    public final double rotation;
    public final double xzScale;
    public final double yScale;

    private int minWorldY = 0;

    public CoordsTranslator(Vector2D coordCenter, Vector2D ingameCenter, double rotation, double xzScale, double yScale, int minWorldY) {
        this.mapCenter = new Vector2D(rad(coordCenter.x), rad(coordCenter.z));
        this.ingameCenter = new Vector2D(ingameCenter);
        this.rotation = rotation;
        this.xzScale = xzScale;
        this.yScale = yScale;
        this.minWorldY = minWorldY;
    }

    public void setAltShift(int altShift) {
        this.altShift = altShift;
    }

    // the highest point in brno is around 479 m, the lowest around 180 m
    public double altToY(double alt) {
        return heightToY(alt + altShift) + minWorldY;
    }

    public double yToAlt(double y) {
        return yToHeight(y - minWorldY) - altShift;
    }

    public double heightToY(double height) {
        return height * yScale;
    }

    public double yToHeight(double y) {
        return y / yScale;
    }


    // Using Orthographic projection https://en.wikipedia.org/wiki/Orthographic_map_projection
    public Vector2D latLonToXZ(double lat, double lon) {
        lat = rad(lat);
        lon = rad(lon);

        double deltaLon = lon - mapCenter.lon();
        double x = EARTH_RADIUS * Math.cos(lat) * Math.sin(deltaLon);
        double z = EARTH_RADIUS * (Math.cos(mapCenter.lat()) * Math.sin(lat) - Math.sin(mapCenter.lat()) * Math.cos(lat) * Math.cos(deltaLon));

        double x2 = x * Math.cos(rotation) - z * Math.sin(rotation);
        double z2 = x * Math.sin(rotation) + z * Math.cos(rotation);

        x = x2;
        z = z2;

        x *= xzScale;
        z *= -xzScale;

        return new Vector2D(x, z).add(ingameCenter);
    }

    public Vector2D latLonToXZ(Vector2D point) {
        return latLonToXZ(point.x, point.z);
    }

    public Vector3D latLonToXZ(Vector3D point) {
        return new Vector3D(latLonToXZ(point.x, point.z), altToY(point.y));
    }

    public Vector2D XZToLatLon(double x, double z) {
        x -= ingameCenter.x;
        z -= ingameCenter.z;

        x /= xzScale;
        z /= -xzScale;

        double x2 = x * Math.cos(-rotation) - z * Math.sin(-rotation);
        double z2 = x * Math.sin(-rotation) + z * Math.cos(-rotation);

        x = x2;
        z = z2;

        double rho = Math.sqrt(x*x + z*z);
        double c = Math.asin(rho / EARTH_RADIUS);
        double cosC = Math.cos(c);
        double sinC = Math.sin(c);
        double cosPhi0 = Math.cos(mapCenter.lat());
        double sinPhi0 = Math.sin(mapCenter.lat());

        double lat = rho == 0 ? mapCenter.lat() : Math.asin(cosC * sinPhi0 + (z * sinC * cosPhi0) / rho);
        double lon = mapCenter.lon() + Math.atan2(x * sinC, rho * cosC * cosPhi0 - z * sinC * sinPhi0);

        return new Vector2D(deg(lat), deg(lon));
    }

    public Vector2D XZToLatLon(Vector2D point) {
        return XZToLatLon(point.x, point.z);
    }

    public Vector3D XZToLatLon(Vector3D point) {
        return new Vector3D(XZToLatLon(point.x, point.z), yToAlt(point.y));
    }

    public String PointToGeom(Vector2D point) {
        return String.format("ST_GeomFromText('POINT(%s)')", point.toLonLatString(" "));
    }

    public String CornersToGeom(Vector2D from, Vector2D to) {
        double fx = Math.min(from.x, to.x);
        double fy = Math.min(from.z, to.z);
        double tx = Math.max(from.x, to.x);
        double ty = Math.max(from.z, to.z);

        return String.format(Locale.ROOT, "%.10f,%.10f,%.10f,%.10f", fx, fy, tx, ty);
    }

    private double rad(double deg) {
        return deg / 180 * Math.PI;
    }

    private double deg (double rad) {
        return rad / Math.PI * 180;
    }
}
