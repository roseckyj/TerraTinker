import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class HighestBlockAtNode extends AbstractNode {
    static title = "Highest Block At";
    static category = "Minecraft";
    static type = "highestBlockAt";
    static helpPath = "/nodes/minecraft/highestBlockAt";

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
                y: {
                    type: "float",
                    title: "Y",
                },
                material: {
                    type: "material",
                    title: "Material",
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

        this.outputState.y.nullable = inputNullable;
        this.outputState.material.nullable = true;
    }
}
