import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class BlocksToMetersNode extends AbstractNode {
    static title = "Blocks to Meters";
    static category = "Geometry";
    static type = "blocksToMeters";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                blocks: {
                    type: "float",
                    title: "Blocks",
                },
            },
            {
                meters: {
                    type: "float",
                    title: "Meters",
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
