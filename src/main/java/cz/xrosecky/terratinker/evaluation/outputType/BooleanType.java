package cz.xrosecky.terratinker.evaluation.outputType;

public class BooleanType extends AbstractType {
    private final Boolean value;

    public BooleanType(Boolean value) {
        this.value = value;
    }

    public static BooleanType fromString(String value) {
        return new BooleanType(Boolean.parseBoolean(value));
    }

    @Override
    public Boolean getValue() {
        return value;
    }

    @Override
    public String getStringValue() {
        return value ? "true" : "false";
    }

    @Override
    public Float getFloatValue() {
        return value ? 1.0f : 0.0f;
    }

    @Override
    public Boolean getBooleanValue() {
        return value;
    }

    @Override
    public boolean isNull() {
        return value == null;
    }
}
