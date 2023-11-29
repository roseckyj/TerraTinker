package cz.xrosecky.terratinker.evaluation.outputType;

import org.bukkit.Material;
import org.bukkit.NamespacedKey;

public class MaterialType extends AbstractType {
    private final Material value; // To be changed to the Material enum

    public MaterialType(Material value) {
        this.value = value;
    }

    public static Material materialFromString(String value) {
        NamespacedKey key = new NamespacedKey(NamespacedKey.MINECRAFT, value);
        return Material.getMaterial(key.getKey().toUpperCase(), false);
    }

    public static MaterialType fromString(String value) {
        return new MaterialType(materialFromString(value));
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
        return value.getKey().getKey();
    }

    @Override
    public boolean isNull() {
        return value == null;
    }
}
