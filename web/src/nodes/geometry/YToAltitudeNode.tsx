import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class YToAltitudeNode extends AbstractNode {
    static title = "Y to Altitude";
    static category = "Geometry";
    static type = "yToAltitude";
    static helpPath = "/nodes/geometry/tranformations";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                y: {
                    type: "float",
                    title: "Y",
                },
            },
            {
                altitude: {
                    type: "float",
                    title: "Altitude",
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
