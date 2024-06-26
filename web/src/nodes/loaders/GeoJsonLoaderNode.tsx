import { AbstractGenericLoaderNode } from "./AbstractGenericLoaderNode";

export class GeoJsonLoaderNode extends AbstractGenericLoaderNode {
    static title = "GeoJSON";
    static category = "Loaders";
    static type = "geoJsonLoader";
    static isFork = true;
    static helpPath = "/nodes/loader/geoJsonLoader";
}
