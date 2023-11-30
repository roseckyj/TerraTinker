package cz.xrosecky.terratinker.geometry;

import org.bukkit.Location;

import java.util.Locale;

public class Vector2D {

    public Vector2D(Location location) {
        this.x = location.getX();
        this.z = location.getZ();
    }

    public Vector2D(Vector2DInt p) {
        this.x = p.x;
        this.z = p.z;
    }

    public Vector2D(Vector3D vec3) {
        x = vec3.x;
        z = vec3.z;
    }

    public double lat() {
        return x;
    }

    public double lon() {
        return z;
    }

    public String toLonLatString(String sep) {
        return String.format(Locale.ROOT, "%.10f" + sep + "%.10f", z, x);
    }

    public String toLatLonString(String sep) {
        return String.format(Locale.ROOT, "%.10f" + sep + "%.10f", x, z);
    }

    public boolean within(Vector2D a, Vector2D b) {
        return x >= Math.min(a.x, b.x) && x < Math.max(a.x, b.x) && z >= Math.min(a.z, b.z) && z < Math.max(a.z, b.z);
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = (int)Math.floor(prime * result + x * 10000);
        result = (int)Math.floor(prime * result + z * 10000);
        return result;
    }
    /**
     * Represents the Zero vector (0,0)
     */
    public final static Vector2D ZERO = new Vector2D(0, 0);
    /**
     * Represents a unit vector in the X direction (1,0)
     */
    public final static Vector2D UNIT_X = new Vector2D(1, 0);
    /**
     * Represents a unit vector in the Y direction (0,1)
     */
    public final static Vector2D UNIT_Y = new Vector2D(0, 1);
    /**
     * Represents a unit vector (1,1)
     */
    public static Vector2D ONE = new Vector2D(1, 1);
    public double x, z;

    /**
     * Construct and Initialized a Pointf2D from the given x, y
     *
     * @param x the x coordinate
     * @param y the y coordinate
     */
    public Vector2D(double x, double y) {
        this.x = x;
        this.z = y;
    }

    /**
     * Construct and Initialized a Pointf2D from the given x, y
     *
     * @param x the x coordinate
     * @param y the y coordinate
     */
    public Vector2D(Double x, Double y) {
        this(x.doubleValue(), y.doubleValue());
    }

    /**
     * Construct and Initialized a Pointf2D to (0,0)
     */
    public Vector2D() {
        this(0, 0);
    }

    /**
     * Construct and Initialized a Pointf2D from an old Pointf2D
     *
     * @param original
     */
    public Vector2D(Vector2D original) {
        this(original.x, original.z);
    }

    /**
     * Gets the X coordiante
     *
     * @return The X coordinate
     */
    public double getX() {
        return x;
    }

    /**
     * Gets the Y coordiante
     *
     * @return The Y coordinate
     */
    public double getY() {
        return z;
    }

    /**
     * Adds this Pointf2D to the value of the Pointf2D argument
     *
     * @param that The Pointf2D to add
     * @return the new Pointf2D
     */
    public Vector2D add(Vector2D that) {
        return Vector2D.add(this, that);
    }

    /**
     * Subtracts this Pointf2D to the value of the Pointf2D argument
     *
     * @param that The Pointf2D to subtract
     * @return the new Pointf2D
     */
    public Vector2D subtract(Vector2D that) {
        return Vector2D.subtract(this, that);
    }

    /**
     * Scales this Pointf2D by the value of the argument
     *
     * @param scale The amount to scale by
     * @return A new Pointf2D scaled by the amount.
     */
    public Vector2D scale(double scale) {
        return Vector2D.scale(this, scale);
    }

    /**
     * Scales this Pointf2D by the value of the argument
     *
     * @param scale The amount to scale by
     * @return A new Pointf2D scaled by the amount.
     */
    public Vector2D scale(Vector2D scale) {
        return new Vector2D(x * scale.x, z * scale.z);
    }

    /**
     * Returns this Pointf2D dot the Pointf2D argument. Dot Product is defined as
     * a.x*b.x + a.y*b.y
     *
     * @param that The Pointf2D to dot with this.
     * @return The dot product
     */
    public double dot(Vector2D that) {
        return Vector2D.dot(this, that);
    }

    /**
     * Returns a Pointf3D object with a y-value of 0.
     * The x of this Pointf2D becomes the x of the Pointf3D,
     * the y of this Pointf2D becomes the z of the Pointf3D.
     *
     * @return
     */
    public Vector3D toPointf3D() {
        return Vector2D.toPointf3D(this);
    }

    /**
     * Returns a Pointf3D object with the given y value.
     * The x of this Pointf2D becomes the x of the Pointf3D,
     * the y of this Pointf2D becomes the z of the Pointf3D.
     *
     * @param y Y value to use in the new Pointf3D.
     * @return
     */
    public Vector3D toPointf3D(double y) {
        return Vector2D.toPointf3D(this, y);
    }

    /**
     * Returns the Cross Product of this Pointf2D Note: Cross Product is
     * undefined in 2d space. This returns the orthogonal vector to this vector
     *
     * @return The orthogonal vector to this vector.
     */
    public Vector2D cross() {
        return new Vector2D(z, -x);
    }

    /**
     * Rounds the X and Y values of this Pointf2D up to
     * the nearest integer value.
     *
     * @return
     */
    public Vector2D ceil() {
        return new Vector2D(Math.ceil(x), Math.ceil(z));
    }

    /**
     * Rounds the X and Y values of this Pointf2D down to
     * the nearest integer value.
     *
     * @return
     */
    public Vector2D floor() {
        return new Vector2D(Math.floor(x), Math.floor(z));
    }

    /**
     * Rounds the X and Y values of this Pointf2D to
     * the nearest integer value.
     *
     * @return
     */
    public Vector2D round() {
        return new Vector2D(Math.round(x), Math.round(z));
    }

    /**
     * Sets the X and Y values of this Pointf2D to their
     * absolute value.
     *
     * @return
     */
    public Vector2D abs() {
        return new Vector2D(Math.abs(x), Math.abs(z));
    }

    /**
     * Gets the distance between this Pointf2D and a given Pointf2D.
     *
     * @param a
     * @return
     */
    public double distance(Vector2D a) {
        return Vector2D.distance(a, this);
    }

    /**
     * Raises the X and Y values of this Pointf2D to the given power.
     *
     * @param power
     * @return
     */
    public Vector2D pow(double power) {
        return Vector2D.pow(this, power);
    }

    /**
     * Calculates the length of this Pointf2D squared.
     *
     * @return the squared length
     */
    public double lengthSquared() {
        return Vector2D.lengthSquared(this);
    }

    /**
     * Calculates the length of this Pointf2D Note: This makes use of the sqrt
     * function, and is not cached. That could affect performance
     *
     * @return the length of this Pointf2D
     */
    public double length() {
        return Vector2D.length(this);
    }

    /**
     * Returns this Pointf2D where the length is equal to 1
     *
     * @return This Pointf2D with length 1
     */
    public Vector2D normalize() {
        return Vector2D.normalize(this);
    }

    /**
     * Returns this Pointf2D in an array. Element 0 contains x Element 1 contains
     * y
     *
     * @return The array containing this Pointf2D
     */
    public double[] toArray() {
        return Vector2D.toArray(this);
    }

    /**
     * Compares two Pointf3Ds
     */
    public int compareTo(Vector2D o) {
        return Vector2D.compareTo(this, o);
    }

    /**
     * Checks if two Pointf2Ds are equal
     */
    @Override
    public boolean equals(Object o) {
        return Vector2D.equals(this, o);
    }

    /**
     * Returns the length of the provided Pointf2D Note: This makes use of the
     * sqrt function, and is not cached. This could affect performance.
     *
     * @param a The Pointf2D to calculate the length of
     * @return The length of the Pointf2D
     */
    public static double length(Vector2D a) {
        return (double) Math.sqrt(lengthSquared(a));
    }

    /**
     * Returns the length squared of the provided Pointf2D
     *
     * @param a the Pointf2D to calculate the length squared
     * @return the length squared of the Pointf2D
     */
    public static double lengthSquared(Vector2D a) {
        return Vector2D.dot(a, a);
    }

    /**
     * Returns a Pointf2D that is the unit form of the provided Pointf2D
     *
     * @param a
     * @return
     */
    public static Vector2D normalize(Vector2D a) {
        return Vector2D.scale(a, (1.f / a.length()));
    }

    /**
     * Subtracts one Pointf2D from the other Pointf2D
     *
     * @param a
     * @param b
     * @return
     */
    public static Vector2D subtract(Vector2D a, Vector2D b) {
        return new Vector2D(a.getX() - b.getX(), a.getY() - b.getY());
    }

    /**
     * Adds one Pointf2D to the other Pointf2D
     *
     * @param a
     * @param b
     * @return
     */
    public static Vector2D add(Vector2D a, Vector2D b) {
        return new Vector2D(a.getX() + b.getX(), a.getY() + b.getY());
    }

    /**
     * Scales the Pointf2D by the ammount
     *
     * @param a
     * @param b
     * @return
     */
    public static Vector2D scale(Vector2D a, double b) {
        return new Vector2D(a.getX() * b, a.getY() * b);
    }

    /**
     * Calculates the Dot Product of two Pointf2Ds Dot Product is defined as
     * a.x*b.x + a.y*b.y
     *
     * @param a
     * @param b
     * @return
     */
    public static double dot(Vector2D a, Vector2D b) {
        return a.getX() * b.getX() + a.getY() * b.getY();
    }

    /**
     * Returns a Pointf3D object with a y-value of 0.
     * The x of the Pointf2D becomes the x of the Pointf3D,
     * the y of the Pointf2D becomes the z of the Pointf3D.
     *
     * @param o Pointf2D to use as the x/z values
     * @return
     */
    public static Vector3D toPointf3D(Vector2D o) {
        return new Vector3D(o.x, 0, o.z);
    }

    /**
     * Returns a Pointf3D object with the given y-value.
     * The x of the Pointf2D becomes the x of the Pointf3D,
     * the y of the Pointf2D becomes the z of the Pointf3D.
     *
     * @param o Pointf2D to use as the x/z values
     * @param y Y value of the new Pointf3D
     * @return
     */
    public static Vector3D toPointf3D(Vector2D o, double y) {
        return new Vector3D(o.x, y, o.z);
    }

    /**
     * Rounds the X and Y values of the given Pointf2D up to
     * the nearest integer value.
     *
     * @param o Pointf2D to use
     * @return
     */
    public static Vector2D ceil(Vector2D o) {
        return new Vector2D(Math.ceil(o.x), Math.ceil(o.z));
    }

    /**
     * Rounds the X and Y values of the given Pointf2D down to
     * the nearest integer value.
     *
     * @param o Pointf2D to use
     * @return
     */
    public static Vector2D floor(Vector2D o) {
        return new Vector2D(Math.floor(o.x), Math.floor(o.z));
    }

    /**
     * Rounds the X and Y values of the given Pointf2D to
     * the nearest integer value.
     *
     * @param o Pointf2D to use
     * @return
     */
    public static Vector2D round(Vector2D o) {
        return new Vector2D(Math.round(o.x), Math.round(o.z));
    }

    /**
     * Sets the X and Y values of the given Pointf2D to their
     * absolute value.
     *
     * @param o Pointf2D to use
     * @return
     */
    public static Vector2D abs(Vector2D o) {
        return new Vector2D(Math.abs(o.x), Math.abs(o.z));
    }

    /**
     * Returns a Pointf2D containing the smallest X and Y values.
     *
     * @param o1
     * @param o2
     * @return
     */
    public static Vector2D min(Vector2D o1, Vector2D o2) {
        return new Vector2D(Math.min(o1.x, o2.x), Math.min(o1.z, o2.z));
    }

    /**
     * Returns a Pointf2D containing the largest X and Y values.
     *
     * @param o1
     * @param o2
     * @return
     */
    public static Vector2D max(Vector2D o1, Vector2D o2) {
        return new Vector2D(Math.max(o1.x, o2.x), Math.max(o1.z, o2.z));
    }

    /**
     * Returns a Pointf2D with random X and Y values (between 0 and 1)
     *
     * @return
     */
    public static Vector2D rand() {
        return new Vector2D(Math.random(), Math.random());
    }

    /**
     * Returns the provided Pointf2D in an array. Element 0 contains x Element 1
     * contains y
     *
     * @return The array containing the Pointf2D
     */
    public static double[] toArray(Vector2D a) {
        return new double[]{a.getX(), a.getY()};
    }

    /**
     * Compares two Pointf3Ds
     */
    public static int compareTo(Vector2D a, Vector2D b) {
        return (int) a.lengthSquared() - (int) b.lengthSquared();
    }

    /**
     * Gets the distance between two Pointf2D.
     *
     * @param a
     * @param b
     * @return
     */
    public static double distance(Vector2D a, Vector2D b) {
        Vector2D tempVector = Vector2D.pow(Vector2D.subtract(a, b), 2);
        return Math.sqrt(tempVector.x + tempVector.z);
    }

    /**
     * Raises the X and Y values of a Pointf2D to the given power.
     *
     * @param o
     * @param power
     * @return
     */
    public static Vector2D pow(Vector2D o, double power) {
        return new Vector2D(Math.pow(o.x, power), Math.pow(o.z, power));
    }

    /**
     * Checks if two Pointf2Ds are equal
     */
    public static boolean equals(Object a, Object b) {
        if (!(a instanceof Vector2D) || !(b instanceof Vector2D)) {
            return false;
        }
        if (a == b) {
            return true;
        }
        return compareTo((Vector2D) a, (Vector2D) b) == 0;
    }

    @Override
    public String toString() {
        return "(" + x + ", " + z + ")";
    }
}