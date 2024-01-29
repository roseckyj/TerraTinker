import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class AltitudeToYNode extends AbstractNode {
    static title = "Altitude to Y";
    static category = "Geometry";
    static type = "altitudeToY";
    static helpPath = "/nodes/geometry/tranformations";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                altitude: {
                    type: "float",
                    title: "Altitude",
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
