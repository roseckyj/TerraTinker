import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class ConstantBooleanNode extends AbstractNode {
    static title = "Constant Boolean";
    static category = "Boolean";
    static type = "constantBoolean";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                boolean: {
                    type: "boolean",
                    title: "Boolean",
                },
            },
            {
                boolean: {
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

        this.outputState.boolean.nullable = inputNullable;
    }
}
