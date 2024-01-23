import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class MaterialByNameNode extends AbstractNode {
    static title = "Material by Name";
    static category = "Material";
    static type = "materialByName";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                name: {
                    type: "string",
                    title: "Material Name",
                },
            },
            {
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

        this.outputState.material.nullable = inputNullable;
    }
}
