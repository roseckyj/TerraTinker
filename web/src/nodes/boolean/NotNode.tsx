import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class NotNode extends AbstractNode {
    static title = "Not";
    static category = "Boolean";
    static type = "not";
    static helpPath = "/nodes/boolean/not";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                input: {
                    type: "boolean",
                    title: "Input",
                },
            },
            {
                output: {
                    type: "boolean",
                    title: "Result",
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
