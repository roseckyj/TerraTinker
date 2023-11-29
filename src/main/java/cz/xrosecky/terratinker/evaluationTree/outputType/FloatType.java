package cz.xrosecky.terratinker.evaluationTree.outputType;

public class FloatType extends AbstractType {
    private final Float value;

    public FloatType(Float value) {
        this.value = value;
    }

    public static FloatType fromString(String value) {
        return new FloatType(Float.parseFloat(value));
    }

    @Override
    public Float getValue() {
        return value;
    }

    @Override
    public Float getFloatValue() {
        return value;
    }

    @Override
    public Boolean getBooleanValue() {
        return Math.abs(value) > 0.0001f;
    }

    @Override
    public boolean isNull() {
        return value == null;
    }
}
