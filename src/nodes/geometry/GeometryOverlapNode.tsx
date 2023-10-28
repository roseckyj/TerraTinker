import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class GeometryOverlapNode extends AbstractNode {
    static title = "Geometry Overlaps";
    static category = "Geometry";
    static type = "geometryOverlap";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                a: {
                    type: "geometry",
                    title: "A",
                },
                b: {
                    type: "geometry",
                    title: "B",
                },
            },
            {
                output: {
                    type: "boolean",
                    title: "Overlap",
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
