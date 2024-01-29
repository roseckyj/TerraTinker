import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class RasterInfoNode extends AbstractNode {
    static title = "Raster Info";
    static category = "Raster";
    static type = "rasterInfo";
    static helpPath = "/nodes/raster/rasterInfo";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                raster: {
                    type: "raster",
                    title: "Raster",
                },
            },
            {
                region: {
                    type: "geometry",
                    title: "Region",
                },
                min: {
                    type: "float",
                    title: "Minimum value",
                },
                max: {
                    type: "float",
                    title: "Maximum value",
                },
                minY: {
                    type: "float",
                    title: "Minimum Y",
                },
                maxY: {
                    type: "float",
                    title: "Maximum Y",
                },
            },
            params
        );
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);

        // If any input is nullable, all outputs are nullable
        const inputNullable = Object.values(this.inputState).some(
            (state) => state.nullable
        );

        Object.values(this.outputState).forEach((state) => {
            state.nullable = inputNullable;
        });
    }
}
