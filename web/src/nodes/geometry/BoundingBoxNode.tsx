import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class BoundingBoxNode extends AbstractNode {
    static title = "Bounding Box";
    static category = "Geometry";
    static type = "boundingBox";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                input: {
                    type: "geometry",
                    title: "Geometry",
                },
            },
            {
                geometry: {
                    type: "geometry",
                    title: "Bounding Box",
                },
                minX: {
                    type: "float",
                    title: "Min X",
                },
                maxX: {
                    type: "float",
                    title: "Max X",
                },
                width: {
                    type: "float",
                    title: "Width (size X)",
                },
                minZ: {
                    type: "float",
                    title: "Min Z",
                },
                maxZ: {
                    type: "float",
                    title: "Max Z",
                },
                height: {
                    type: "float",
                    title: "Height (size Z)",
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

        Object.keys(this.outputState).forEach((key) => {
            this.outputState[key].nullable = inputNullable;
        });
    }
}
