import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class ConstantNumberNode extends AbstractNode {
    static title = "Constant Number";
    static category = "Number";
    static type = "constantNumber";
    static helpPath = "/nodes/constant";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                input: {
                    type: "float",
                    title: "Number",
                },
            },
            {
                output: {
                    type: "float",
                    title: "Number",
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
