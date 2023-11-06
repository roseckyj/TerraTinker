import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class SequenceNode extends AbstractNode {
    static title = "Sequence";
    static category = "Number";
    static type = "sequence";
    static isFork = true;

    public constructor(params: NodeConstructorParams) {
        super(
            {
                from: {
                    type: "float",
                    title: "From",
                },
                step: {
                    type: "float",
                    title: "Step",
                },
                count: {
                    type: "float",
                    title: "Count",
                },
            },
            {
                number: {
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

        this.outputState.float.nullable = inputNullable;
    }
}
