package cz.xrosecky.terratinker.evaluationTree.outputType;

import cz.xrosecky.terratinker.types.Raster;

public class RasterType extends AbstractType {
    private final Raster value; // To be changed to the Raster type

    public RasterType(Raster value) {
        this.value = value;
    }

    public static RasterType fromString(String value) {
        return new RasterType(Raster.emptyRaster());
    }

    @Override
    public Raster getValue() {
        return value;
    }

    public static RasterType emptyRaster() {
        return new RasterType(new Raster());
    }

    @Override
    public Raster getRasterValue() {
        return value;
    }

    @Override
    public boolean isNull() {
        return value == null;
    }
}
