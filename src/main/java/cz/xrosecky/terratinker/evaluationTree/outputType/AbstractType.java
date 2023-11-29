package cz.xrosecky.terratinker.evaluationTree.outputType;

import org.json.JSONObject;

import cz.xrosecky.terratinker.types.Geometry;
import cz.xrosecky.terratinker.types.Material;
import cz.xrosecky.terratinker.types.Raster;

public abstract class AbstractType {
    public abstract Object getValue();

    public static AbstractType fromJson(JSONObject inputJson) {
        // {"kind":"value","type":"material","value":"gold_block"}
        if (!inputJson.getString("kind").equals("value")) {
            throw new RuntimeException("Not a value input");
        }

        AbstractType type = switch (inputJson.getString("type")) {
            case "string" -> new StringType(inputJson.getString("value"));
            case "boolean" -> new BooleanType(inputJson.getBoolean("value"));
            case "float" -> new FloatType(inputJson.getFloat("value"));

            case "geometry" -> GeometryType.fromString(inputJson.getString("value"));
            case "material" -> MaterialType.fromString(inputJson.getString("value"));
            case "raster" -> RasterType.fromString(inputJson.getString("value"));

            default -> new NullType();
        };

        return type;
    }

    // Type getters

    public String getStringValue() {
        return getValue().toString();
    }

    public static AbstractType fromString(String value) {
        return null;
    }

    public Float getFloatValue() {
        return null;
    }

    public Boolean getBooleanValue() {
        return null;
    }

    public Material getMaterialValue() {
        return null;
    }

    public Geometry getGeometryValue() {
        return null;
    }

    public Raster getRasterValue() {
        return null;
    }

    public abstract boolean isNull();

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof AbstractType) {
            AbstractType other = (AbstractType) obj;
            return getValue().equals(other.getValue());
        }
        return false;
    }
}
