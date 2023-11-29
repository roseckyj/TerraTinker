import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class ConstantStringNode extends AbstractNode {
    static title = "Constant String";
    static category = "String";
    static type = "constantString";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                input: {
                    type: "string",
                    title: "String",
                },
            },
            {
                output: {
                    type: "string",
                    title: "String",
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
