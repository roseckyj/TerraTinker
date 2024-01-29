import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class ConstantMaterialNode extends AbstractNode {
    static title = "Constant Material";
    static category = "Material";
    static type = "constantMaterial";
    static helpPath = "/nodes/constant";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                input: {
                    type: "material",
                    title: "Material",
                },
            },
            {
                output: {
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

        this.outputState.output.nullable = inputNullable;
    }
}
