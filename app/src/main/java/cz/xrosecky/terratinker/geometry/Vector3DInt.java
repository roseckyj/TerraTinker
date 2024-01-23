package cz.xrosecky.terratinker.geometry;

import org.bukkit.Location;
import org.bukkit.World;

public class Vector3DInt implements Comparable<Vector3DInt> {
    public Vector3DInt(Vector2D p, int y) {
        this.x = (int) p.x;
        this.y = y;
        this.z = (int) p.z;
    }

    public Vector3DInt(Vector2DInt p, int y) {
        this.x = p.x;
        this.y = y;
        this.z = p.z;
    }

    public double lat() {
        return x;
    }

    public double lon() {
        return y;
    }

    public double alt() {
        return z;
    }

    public Vector2D xz() {
        return new Vector2D(x, z);
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = (int)Math.floor(prime * result + x * 100);
        result = (int)Math.floor(prime * result + y * 100);
        result = (int)Math.floor(prime * result + z * 100);
        return result;
    }/**
     * Vector with all elements set to 0. (0, 0, 0)
     */
    public final static Vector3DInt ZERO = new Vector3DInt(0, 0, 0);
    /**
     * Unit Vector in the X direction. (1, 0, 0)
     */
    public final static Vector3DInt UNIT_X = new Vector3DInt(1, 0, 0);
    /**
     * Unit Vector facing Forward. (1, 0, 0)
     */
    public final static Vector3DInt Forward = UNIT_X;
    /**
     * Unit Vector in the Y direction. (0, 1, 0)
     */
    public final static Vector3DInt UNIT_Y = new Vector3DInt(0, 1, 0);
    /**
     * Unit Vector pointing Up. (0, 1, 0)
     */
    public final static Vector3DInt Up = UNIT_Y;
    /**
     * Unit Vector in the Z direction. (0, 0, 1)
     */
    public final static Vector3DInt UNIT_Z = new Vector3DInt(0, 0, 1);
    /**
     * Unit Vector pointing Right. (0, 0, 1)
     */
    public final static Vector3DInt Right = UNIT_Z;
    /**
     * Unit Vector with all elements set to 1. (1, 1, 1)
     */
    public final static Vector3DInt ONE = new Vector3DInt(1, 1, 1);
    public int x, y, z;

    /**
     * Constructs a new Pointf3D with the given x, y, z
     *
     * @param x
     * @param y
     * @param z
     */
    public Vector3DInt(int x, int y, int z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Constructs a new Pointf3D with the given x, y, z
     *
     * @param x
     * @param y
     * @param z
     */
    public Vector3DInt(Integer x, Integer y, Integer z) {
        this(x.intValue(), y.intValue(), z.intValue());
    }

    /**
     * Constructs a new Pointf3D with all elements set to 0
     */
    public Vector3DInt() {
        this(0, 0, 0);
    }

    /**
     * Constructs a new Pointf3D that is a clone of the given Pointf3D
     *
     * @param clone
     */
    public Vector3DInt(Vector3DInt clone) {
        this(clone.x, clone.y, clone.z);
    }

    /**
     * Constructs a new Pointf3D from the given Pointf2D and z set to 0
     *
     * @param vector
     */
    public Vector3DInt(Vector2D vector) {
        this(vector, 0);
    }

    /**
     * Adds two vectors
     *
     * @param that
     * @return
     */
    public Vector3DInt add(Vector3DInt that) {
        return Vector3DInt.add(this, that);
    }

    /**
     * Subtracts two vectors
     *
     * @param that
     * @return
     */
    public Vector3DInt subtract(Vector3DInt that) {
        return Vector3DInt.subtract(this, that);
    }

    /**
     * Scales by the scalar value
     *
     * @param scale
     * @return
     */
    public Vector3DInt multiply(int scale) {
        return Vector3DInt.multiply(this, scale);
    }

    /**
     * Takes the dot product of two vectors
     *
     * @param that
     * @return
     */
    public double dot(Vector3DInt that) {
        return Vector3DInt.dot(this, that);
    }

    /**
     * Takes the cross product of two vectors
     *
     * @param that
     * @return
     */
    public Vector3DInt cross(Vector3DInt that) {
        return Vector3DInt.cross(this, that);
    }

    /**
     * Returns a Pointf2D object using the X and Z values of
     * this Pointf3D. The x of this Pointf3D becomes the x
     * of the Pointf2D, and the z of this Pointf3D becomes the
     * y of the Pointf2D.
     *
     * @return
     */
    public Vector2D toPointf2D() {
        return Vector3DInt.toPointf2D(this);
    }

    /**
     * Sets the X, Y, and Z values of this Pointf3D to their
     * absolute value.
     *
     * @return
     */
    public Vector3DInt abs() {
        return new Vector3DInt(Math.abs(x), Math.abs(y), Math.abs(z));
    }

    /**
     * Gets the distance between this Pointf3D and a given Pointf3D.
     *
     * @param a
     * @return
     */
    public double distance(Vector3DInt a) {
        return Vector3DInt.distance(a, this);
    }

    /**
     * returns the squared length of the vector
     *
     * @return
     */
    public double lengthSquared() {
        return Vector3DInt.lengthSquared(this);
    }

    /**
     * returns the length of this vector. Note: makes use of Math.sqrt and is
     * not cached.
     *
     * @return
     */
    public double length() {
        return Vector3DInt.length(this);
    }

    /**
     * Returns a fast approximation of this vector's length.
     *
     * @return
     */
    public double fastLength() {
        return Vector3DInt.fastLength(this);
    }

    /**
     * returns the vector as [x,y,z]
     *
     * @return
     */
    public double[] toArray() {
        return Vector3DInt.toArray(this);
    }

    /**
     * Compares two Pointf3Ds
     */
    public int compareTo(Vector3DInt o) {
        return Vector3DInt.compareTo(this, o);
    }
    
    /**
     * toString Override
     */
    public String toString() {
        return String.format("{ %f, %f, %f }", x, y, z);
    }

    /**
     * Returns the length of the given vector.
     *
     * Note: Makes use of Math.sqrt and
     * is not cached, so can be slow
     *
     * Also known as norm. ||a||
     *
     * @param a
     * @return
     */
    public static double length(Vector3DInt a) {
        return Math.sqrt(lengthSquared(a));
    }

    /**
     * Returns an approximate length of the given vector.
     *
     * @param a
     * @return
     */
    public static double fastLength(Vector3DInt a) {
        return Math.sqrt(lengthSquared(a));
    }

    /**
     * returns the length squared to the given vector
     *
     * @param a
     * @return
     */
    public static double lengthSquared(Vector3DInt a) {
        return Vector3DInt.dot(a, a);
    }

    /**
     * Creates a new vector that is A - B
     *
     * @param a
     * @param b
     * @return
     */
    public static Vector3DInt subtract(Vector3DInt a, Vector3DInt b) {
        return new Vector3DInt(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    /**
     * Creates a new Vector that is A + B
     *
     * @param a
     * @param b
     * @return
     */
    public static Vector3DInt add(Vector3DInt a, Vector3DInt b) {
        return new Vector3DInt(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    /**
     * Creates a new vector that is A multiplied by the uniform scalar B
     *
     * @param a
     * @param b
     * @return
     */
    public static Vector3DInt multiply(Vector3DInt a, int b) {
        return new Vector3DInt(a.x * b, a.y * b, a.z * b);
    }

    /**
     * Returns the dot product of A and B
     *
     * @param a
     * @param b
     * @return
     */
    public static double dot(Vector3DInt a, Vector3DInt b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    /**
     * Creates a new Vector that is the A x B The Cross Product is the vector
     * orthogonal to both A and B
     *
     * @param a
     * @param b
     * @return
     */
    public static Vector3DInt cross(Vector3DInt a, Vector3DInt b) {
        return new Vector3DInt(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    }

    /**
     * Sets the X, Y, and Z values of the given Pointf3D to their
     * absolute value.
     *
     * @param o Pointf3D to use
     * @return
     */
    public static Vector3DInt abs(Vector3DInt o) {
        return new Vector3DInt(Math.abs(o.x), Math.abs(o.y), Math.abs(o.z));
    }

    /**
     * Returns a Pointf3D containing the smallest X, Y, and Z values.
     *
     * @param o1
     * @param o2
     * @return
     */
    public static Vector3DInt min(Vector3DInt o1, Vector3DInt o2) {
        return new Vector3DInt(Math.min(o1.x, o2.x), Math.min(o1.y, o2.y), Math.min(o1.z, o2.z));
    }

    /**
     * Returns a Pointf3D containing the largest X, Y, and Z values.
     *
     * @param o1
     * @param o2
     * @return
     */
    public static Vector3DInt max(Vector3DInt o1, Vector3DInt o2) {
        return new Vector3DInt(Math.max(o1.x, o2.x), Math.max(o1.y, o2.y), Math.max(o1.z, o2.z));
    }

    /**
     * Returns a Pointf3D with random X, Y, and Z values (between 0 and max)
     *
     * @return
     */
    public static Vector3DInt rand(int max) {
        return new Vector3DInt((int) (max * Math.random()), (int) (max * Math.random()), (int) (max * Math.random()));
    }

    /**
     * Gets the distance between two Pointf3D.
     *
     * @param a
     * @param b
     * @return
     */
    public static double distance(Vector3DInt a, Vector3DInt b) {
        double xzDist = Vector2D.distance(a.toPointf2D(), b.toPointf2D());
        return Math.sqrt(Math.pow(xzDist, 2) + Math.pow(Math.abs(Vector3DInt.subtract(a, b).y), 2));
    }


    /**
     * Returns a Pointf2D object using the X and Z values of
     * the given Pointf3D. The x of the Pointf3D becomes the x
     * of the Pointf2D, and the z of this Pointf3D becomes the
     * y of the Pointf2Dm.
     *
     * @param o Pointf3D object to use
     * @return
     */
    public static Vector2D toPointf2D(Vector3DInt o) {
        return new Vector2D(o.x, o.z);
    }

    /**
     * Returns a new double array that is {x, y, z}
     *
     * @param a
     * @return
     */
    public static double[] toArray(Vector3DInt a) {
        return new double[]{a.x, a.y, a.z};
    }

    /**
     * Compares two Pointf3Ds
     */
    public static int compareTo(Vector3DInt a, Vector3DInt b) {
        return (int) a.lengthSquared() - (int) b.lengthSquared();
    }

    /**
     * Checks if two Pointf3Ds are equal
     */
    public static boolean equals(Object a, Object b) {
        if (!(a instanceof Vector3DInt) || !(b instanceof Vector3DInt)) {
            return false;
        }
        if (a == b) {
            return true;
        }
        Vector3DInt x = (Vector3DInt) a;
        Vector3DInt y = (Vector3DInt) b;
        if (x.x == y.x && x.y == y.y && x.z == y.z) {
            return true;
        }
        return false;
    }

    public Location toLocation(World world) {
        return new Location(world, x, y, z);
    }
}
