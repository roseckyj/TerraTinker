package cz.xrosecky.terratinker.geometry;

public class Vector3D implements Comparable<Vector3D> {

    public Vector3D(Vector2D p, double y) {
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
    public final static Vector3D ZERO = new Vector3D(0, 0, 0);
    /**
     * Unit Vector in the X direction. (1, 0, 0)
     */
    public final static Vector3D UNIT_X = new Vector3D(1, 0, 0);
    /**
     * Unit Vector facing Forward. (1, 0, 0)
     */
    public final static Vector3D Forward = UNIT_X;
    /**
     * Unit Vector in the Y direction. (0, 1, 0)
     */
    public final static Vector3D UNIT_Y = new Vector3D(0, 1, 0);
    /**
     * Unit Vector pointing Up. (0, 1, 0)
     */
    public final static Vector3D Up = UNIT_Y;
    /**
     * Unit Vector in the Z direction. (0, 0, 1)
     */
    public final static Vector3D UNIT_Z = new Vector3D(0, 0, 1);
    /**
     * Unit Vector pointing Right. (0, 0, 1)
     */
    public final static Vector3D Right = UNIT_Z;
    /**
     * Unit Vector with all elements set to 1. (1, 1, 1)
     */
    public final static Vector3D ONE = new Vector3D(1, 1, 1);
    public double x, y, z;

    /**
     * Constructs a new Pointf3D with the given x, y, z
     *
     * @param x
     * @param y
     * @param z
     */
    public Vector3D(double x, double y, double z) {
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
    public Vector3D(Double x, Double y, Double z) {
        this(x.doubleValue(), y.doubleValue(), z.doubleValue());
    }

    /**
     * Constructs a new Pointf3D with all elements set to 0
     */
    public Vector3D() {
        this(0, 0, 0);
    }

    /**
     * Constructs a new Pointf3D that is a clone of the given Pointf3D
     *
     * @param clone
     */
    public Vector3D(Vector3D clone) {
        this(clone.x, clone.y, clone.z);
    }

    /**
     * Constructs a new Pointf3D from the given Pointf2D and z set to 0
     *
     * @param vector
     */
    public Vector3D(Vector2D vector) {
        this(vector, 0);
    }

    /**
     * Adds two vectors
     *
     * @param that
     * @return
     */
    public Vector3D add(Vector3D that) {
        return Vector3D.add(this, that);
    }

    /**
     * Subtracts two vectors
     *
     * @param that
     * @return
     */
    public Vector3D subtract(Vector3D that) {
        return Vector3D.subtract(this, that);
    }

    /**
     * Scales by the scalar value
     *
     * @param scale
     * @return
     */
    public Vector3D multiply(double scale) {
        return Vector3D.multiply(this, scale);
    }

    /**
     * Takes the dot product of two vectors
     *
     * @param that
     * @return
     */
    public double dot(Vector3D that) {
        return Vector3D.dot(this, that);
    }

    /**
     * Takes the cross product of two vectors
     *
     * @param that
     * @return
     */
    public Vector3D cross(Vector3D that) {
        return Vector3D.cross(this, that);
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
        return Vector3D.toPointf2D(this);
    }

    /**
     * Rounds the X, Y, and Z values of this Pointf3D up to
     * the nearest integer value.
     *
     * @return
     */
    public Vector3D ceil() {
        return new Vector3D(Math.ceil(x), Math.ceil(y), Math.ceil(z));
    }

    /**
     * Rounds the X, Y, and Z values of this Pointf3D down to
     * the nearest integer value.
     *
     * @return
     */
    public Vector3D floor() {
        return new Vector3D(Math.floor(x), Math.floor(y), Math.floor(z));
    }

    /**
     * Rounds the X, Y, and Z values of this Pointf3D to
     * the nearest integer value.
     *
     * @return
     */
    public Vector3D round() {
        return new Vector3D(Math.round(x), Math.round(y), Math.round(z));
    }

    /**
     * Sets the X, Y, and Z values of this Pointf3D to their
     * absolute value.
     *
     * @return
     */
    public Vector3D abs() {
        return new Vector3D(Math.abs(x), Math.abs(y), Math.abs(z));
    }

    /**
     * Gets the distance between this Pointf3D and a given Pointf3D.
     *
     * @param a
     * @return
     */
    public double distance(Vector3D a) {
        return Vector3D.distance(a, this);
    }

    /**
     * Raises the X, Y, and Z values of this Pointf3D to the given power.
     *
     * @param power
     * @return
     */
    public Vector3D pow(double power) {
        return Vector3D.pow(this, power);
    }

    /**
     * returns the squared length of the vector
     *
     * @return
     */
    public double lengthSquared() {
        return Vector3D.lengthSquared(this);
    }

    /**
     * returns the length of this vector. Note: makes use of Math.sqrt and is
     * not cached.
     *
     * @return
     */
    public double length() {
        return Vector3D.length(this);
    }

    /**
     * Returns a fast approximation of this vector's length.
     *
     * @return
     */
    public double fastLength() {
        return Vector3D.fastLength(this);
    }

    /**
     * returns the vector with a length of 1
     *
     * @return
     */
    public Vector3D normalize() {
        return Vector3D.normalize(this);
    }

    /**
     * returns the vector as [x,y,z]
     *
     * @return
     */
    public double[] toArray() {
        return Vector3D.toArray(this);
    }

    /**
     * Compares two Pointf3Ds
     */
    public int compareTo(Vector3D o) {
        return Vector3D.compareTo(this, o);
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
    public static double length(Vector3D a) {
        return Math.sqrt(lengthSquared(a));
    }

    /**
     * Returns an approximate length of the given vector.
     *
     * @param a
     * @return
     */
    public static double fastLength(Vector3D a) {
        return Math.sqrt(lengthSquared(a));
    }

    /**
     * returns the length squared to the given vector
     *
     * @param a
     * @return
     */
    public static double lengthSquared(Vector3D a) {
        return Vector3D.dot(a, a);
    }

    /**
     * Returns a new vector that is the given vector but length 1
     *
     * @param a
     * @return
     */
    public static Vector3D normalize(Vector3D a) {
        return Vector3D.multiply(a, (1.0 / a.length()));
    }

    /**
     * Creates a new vector that is A - B
     *
     * @param a
     * @param b
     * @return
     */
    public static Vector3D subtract(Vector3D a, Vector3D b) {
        return new Vector3D(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    /**
     * Creates a new Vector that is A + B
     *
     * @param a
     * @param b
     * @return
     */
    public static Vector3D add(Vector3D a, Vector3D b) {
        return new Vector3D(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    /**
     * Creates a new vector that is A multiplied by the uniform scalar B
     *
     * @param a
     * @param b
     * @return
     */
    public static Vector3D multiply(Vector3D a, double b) {
        return new Vector3D(a.x * b, a.y * b, a.z * b);
    }

    /**
     * Returns the dot product of A and B
     *
     * @param a
     * @param b
     * @return
     */
    public static double dot(Vector3D a, Vector3D b) {
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
    public static Vector3D cross(Vector3D a, Vector3D b) {
        return new Vector3D(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    }

    /**
     * Rounds the X, Y, and Z values of the given Pointf3D up to
     * the nearest integer value.
     *
     * @param o Pointf3D to use
     * @return
     */
    public static Vector3D ceil(Vector3D o) {
        return new Vector3D(Math.ceil(o.x), Math.ceil(o.y), Math.ceil(o.z));
    }

    /**
     * Rounds the X, Y, and Z values of the given Pointf3D down to
     * the nearest integer value.
     *
     * @param o Pointf3D to use
     * @return
     */
    public static Vector3D floor(Vector3D o) {
        return new Vector3D(Math.floor(o.x), Math.floor(o.y), Math.floor(o.z));
    }

    /**
     * Rounds the X, Y, and Z values of the given Pointf3D to
     * the nearest integer value.
     *
     * @param o Pointf3D to use
     * @return
     */
    public static Vector3D round(Vector3D o) {
        return new Vector3D(Math.round(o.x), Math.round(o.y), Math.round(o.z));
    }

    /**
     * Sets the X, Y, and Z values of the given Pointf3D to their
     * absolute value.
     *
     * @param o Pointf3D to use
     * @return
     */
    public static Vector3D abs(Vector3D o) {
        return new Vector3D(Math.abs(o.x), Math.abs(o.y), Math.abs(o.z));
    }

    /**
     * Returns a Pointf3D containing the smallest X, Y, and Z values.
     *
     * @param o1
     * @param o2
     * @return
     */
    public static Vector3D min(Vector3D o1, Vector3D o2) {
        return new Vector3D(Math.min(o1.x, o2.x), Math.min(o1.y, o2.y), Math.min(o1.z, o2.z));
    }

    /**
     * Returns a Pointf3D containing the largest X, Y, and Z values.
     *
     * @param o1
     * @param o2
     * @return
     */
    public static Vector3D max(Vector3D o1, Vector3D o2) {
        return new Vector3D(Math.max(o1.x, o2.x), Math.max(o1.y, o2.y), Math.max(o1.z, o2.z));
    }

    /**
     * Returns a Pointf3D with random X, Y, and Z values (between 0 and 1)
     *
     * @return
     */
    public static Vector3D rand() {
        return new Vector3D(Math.random(), Math.random(), Math.random());
    }

    /**
     * Gets the distance between two Pointf3D.
     *
     * @param a
     * @param b
     * @return
     */
    public static double distance(Vector3D a, Vector3D b) {
        double xzDist = Vector2D.distance(a.toPointf2D(), b.toPointf2D());
        return Math.sqrt(Math.pow(xzDist, 2) + Math.pow(Math.abs(Vector3D.subtract(a, b).y), 2));
    }

    /**
     * Raises the X, Y, and Z values of a Pointf3D to the given power.
     *
     * @param o
     * @param power
     * @return
     */
    public static Vector3D pow(Vector3D o, double power) {
        return new Vector3D(Math.pow(o.x, power), Math.pow(o.y, power), Math.pow(o.z, power));
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
    public static Vector2D toPointf2D(Vector3D o) {
        return new Vector2D(o.x, o.z);
    }

    /**
     * Returns a new double array that is {x, y, z}
     *
     * @param a
     * @return
     */
    public static double[] toArray(Vector3D a) {
        return new double[]{a.x, a.y, a.z};
    }

    /**
     * Compares two Pointf3Ds
     */
    public static int compareTo(Vector3D a, Vector3D b) {
        return (int) a.lengthSquared() - (int) b.lengthSquared();
    }

    /**
     * Checks if two Pointf3Ds are equal
     */
    public static boolean equals(Object a, Object b) {
        if (!(a instanceof Vector3D) || !(b instanceof Vector3D)) {
            return false;
        }
        if (a == b) {
            return true;
        }
        Vector3D x = (Vector3D) a;
        Vector3D y = (Vector3D) b;
        if (x.x == y.x && x.y == y.y && x.z == y.z) {
            return true;
        }
        return false;
    }
}
