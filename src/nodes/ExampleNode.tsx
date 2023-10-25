import {
    AbstractNode,
    NodeConstructorParams,
} from "../components/AbstractNode";
import { GraphState } from "../graphState/graphState";

export class ExampleNode extends AbstractNode {
    static title = "Example Node";
    static category = "Example";
    static type = "example";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                float: {
                    type: "float",
                    title: "Float",
                },
                string: {
                    type: "string",
                    title: "String",
                },
                boolean: {
                    type: "boolean",
                    title: "Boolean",
                },
                material: {
                    type: "material",
                    title: "Material",
                },
                geometry: {
                    type: "geometry",
                    title: "Geometry",
                },
            },
            {
                float: {
                    type: "float",
                    title: "Float",
                },
                string: {
                    type: "string",
                    title: "String",
                },
                boolean: {
                    type: "boolean",
                    title: "Boolean",
                },
                material: {
                    type: "material",
                    title: "Material",
                },
                geometry: {
                    type: "geometry",
                    title: "Geometry",
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

        this.outputState.float.nullable = inputNullable;
        this.outputState.string.nullable = true;
        this.outputState.boolean.nullable = inputNullable;
        this.outputState.material.nullable = true;
        this.outputState.geometry.nullable = inputNullable;
    }
}
