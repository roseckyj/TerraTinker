import { AbstractGenericLoaderNode } from "./AbstractGenericLoaderNode";

export class EsriLoaderNode extends AbstractGenericLoaderNode {
    static title = "ESRI shapefile";
    static category = "Loaders";
    static type = "esriLoader";
}
