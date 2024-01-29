import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class MetersToBlocksNode extends AbstractNode {
    static title = "Meters to Blocks";
    static category = "Geometry";
    static type = "metersToBlocks";
    static helpPath = "/nodes/geometry/tranformations";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                meters: {
                    type: "float",
                    title: "Meters",
                },
            },
            {
                blocks: {
                    type: "float",
                    title: "Blocks",
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
