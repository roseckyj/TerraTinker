package cz.xrosecky.terratinker.nodeInput;

import cz.xrosecky.terratinker.evaluationTree.outputType.AbstractType;

public class ValueNodeInput extends AbstractNodeInput {
    private AbstractType value;

    public ValueNodeInput(AbstractType value) {
        this.value = value;
    }

    public AbstractType getValue() {
        return value;
    }
}
