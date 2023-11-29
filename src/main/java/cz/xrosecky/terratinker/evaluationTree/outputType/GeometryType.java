package cz.xrosecky.terratinker.evaluationTree.outputType;

import cz.xrosecky.terratinker.types.Geometry;

public class GeometryType extends AbstractType {
    private final Geometry value; // To be changed to the Geometry type

    public GeometryType(Geometry value) {
        this.value = value;
    }

    public static GeometryType fromString(String value) {
        return new GeometryType(Geometry.emptyGeometry());
    }

    @Override
    public Geometry getValue() {
        return value;
    }

    public static GeometryType emptyGeometry() {
        return new GeometryType(new Geometry());
    }

    @Override
    public Geometry getGeometryValue() {
        return value;
    }

    @Override
    public boolean isNull() {
        return value == null;
    }
}
