import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class CreateRectangleNode extends AbstractNode {
    static title = "Create Rectangle";
    static category = "Geometry";
    static type = "createRectangle";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                x1: {
                    type: "float",
                    title: "X1",
                },
                x2: {
                    type: "float",
                    title: "X2",
                },
                z1: {
                    type: "float",
                    title: "Z1",
                },
                z2: {
                    type: "float",
                    title: "Z2",
                },
            },
            {
                output: {
                    type: "geometry",
                    title: "Geometry",
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
