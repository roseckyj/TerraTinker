package cz.xrosecky.terratinker.evaluationTree.outputType;

import cz.xrosecky.terratinker.types.Material;

public class MaterialType extends AbstractType {
    private final Material value; // To be changed to the Material enum

    public MaterialType(Material value) {
        this.value = value;
    }

    public static MaterialType fromString(String value) {
        return new MaterialType(Material.fromString(value));
    }

    @Override
    public Material getValue() {
        return value;
    }

    @Override
    public Material getMaterialValue() {
        return value;
    }

    @Override
    public String getStringValue() {
        return value.toString();
    }

    @Override
    public boolean isNull() {
        return value == null;
    }
}
