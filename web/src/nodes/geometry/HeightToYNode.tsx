import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class HeightToYNode extends AbstractNode {
    static title = "Height to Y";
    static category = "Geometry";
    static type = "heightToY";
    static helpPath = "/nodes/geometry/tranformations";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                height: {
                    type: "float",
                    title: "Height",
                },
            },
            {
                y: {
                    type: "float",
                    title: "Y",
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
