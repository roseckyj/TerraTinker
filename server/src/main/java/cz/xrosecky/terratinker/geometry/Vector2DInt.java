package cz.xrosecky.terratinker.geometry;

public class Vector2DInt {
    public final int x;
    public final int z;

    public Vector2DInt(int x, int z) {
        this.x = x;
        this.z = z;
    }

    public Vector2DInt(long x, long z) {
        this.x = (int)x;
        this.z = (int)z;
    }

    public Vector2DInt(Vector3D vector3D) {
        x = (int)Math.round(vector3D.x);
        z = (int)Math.round(vector3D.z);
    }

    public boolean within(Vector2DInt a, Vector2DInt b) {
        return x >= Math.min(a.x, b.x) && x < Math.max(a.x, b.x) && z >= Math.min(a.z, b.z) && z < Math.max(a.z, b.z);
    }

    public Vector2DInt add(Vector2DInt that) {
        return Vector2DInt.add(this, that);
    }

    public static Vector2DInt add(Vector2DInt a, Vector2DInt b) {
        return new Vector2DInt(a.x + b.x, a.z + b.z);
    }

    @Override
    public String toString() {
        return "(" + x + "," + z + ")";
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }

        if (!(other instanceof Vector2DInt)){
            return false;
        }

        Vector2DInt other_ = (Vector2DInt) other;

        return other_.x == this.x && other_.z == this.z;
    }

    @Override
    public int hashCode() {
        final int prime = 997;
        int result = 1;
        result = prime * result + x;
        result = prime * result + z;
        return result;
    }
}