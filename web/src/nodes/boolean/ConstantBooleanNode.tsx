import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class ConstantBooleanNode extends AbstractNode {
    static title = "Constant Boolean";
    static category = "Boolean";
    static type = "constantBoolean";
    static helpPath = "/nodes/constant";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                input: {
                    type: "boolean",
                    title: "Boolean",
                },
            },
            {
                output: {
                    type: "boolean",
                    title: "Boolean",
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
