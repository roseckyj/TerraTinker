package cz.xrosecky.terratinker.evaluationTree.outputType;

public class NullType extends AbstractType {
    public NullType() {
    }

    @Override
    public Object getValue() {
        return null;
    }

    @Override
    public String getStringValue() {
        return null;
    }

    @Override
    public boolean isNull() {
        return true;
    }
}
