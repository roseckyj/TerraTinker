import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class YToHeightNode extends AbstractNode {
    static title = "Y to Height";
    static category = "Geometry";
    static type = "yToHeight";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                y: {
                    type: "float",
                    title: "Y",
                },
            },
            {
                height: {
                    type: "float",
                    title: "Height",
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
