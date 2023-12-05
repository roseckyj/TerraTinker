package cz.xrosecky.terratinker.evaluation.outputType;

import org.bukkit.Material;

public class StringType extends AbstractType {
    private final String value;

    public StringType(String value) {
        this.value = value;
    }

    public static StringType fromString(String value) {
        return new StringType(value);
    }

    @Override
    public String getValue() {
        return value;
    }

    @Override
    public String getStringValue() {
        return value;
    }

    @Override
    public Float getFloatValue() {
        try {
            return Float.parseFloat(value);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Boolean getBooleanValue() {
        return !value.isEmpty();
    }

    @Override
    public Material getMaterialValue() {
        return MaterialType.materialFromString(value);
    }

    @Override
    public boolean isNull() {
        return value == null;
    }
}
