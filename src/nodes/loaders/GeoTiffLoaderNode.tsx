import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class GeoTiffLoaderNode extends AbstractNode {
    static title = "GeoTIFF";
    static category = "Loaders";
    static type = "geoTiffLoader";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                path: {
                    type: "string",
                    title: "Path",
                },
            },
            {
                raster: {
                    type: "raster",
                    title: "Raster",
                },
            },
            params
        );
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);

        this.outputState.raster.nullable = false;
    }
}
