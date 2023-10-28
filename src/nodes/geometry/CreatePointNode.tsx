import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class CreatePointNode extends AbstractNode {
    static title = "Create Point";
    static category = "Geometry";
    static type = "createPoint";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                x: {
                    type: "float",
                    title: "X",
                },
                z: {
                    type: "float",
                    title: "Z",
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
