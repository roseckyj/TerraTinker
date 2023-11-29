package cz.xrosecky.terratinker.evaluationTree.outputType;

import cz.xrosecky.terratinker.types.Material;

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
        return Float.parseFloat(value);
    }

    @Override
    public Boolean getBooleanValue() {
        return !value.isEmpty();
    }

    @Override
    public Material getMaterialValue() {
        return Material.fromString(value);
    }

    @Override
    public boolean isNull() {
        return value == null;
    }
}
