import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/AbstractNode";
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
                output: {
                    type: "geometry",
                    title: "Bounding Box",
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

        this.outputState.output.nullable = inputNullable;
    }
}
