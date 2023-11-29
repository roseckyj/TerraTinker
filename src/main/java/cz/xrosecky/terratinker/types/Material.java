package cz.xrosecky.terratinker.types;

public class Material {
    // May be replaced by the bukkit material enum

    private final String value;

    public Material(String value) {
        this.value = value;
    }

    public static Material fromString(String value) {
        return new Material(value);
    }

    @Override
    public String toString() {
        return value;
    }
}
