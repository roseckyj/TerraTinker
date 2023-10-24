import { GraphState } from "../graphState/graphState";
import { AbstractNode, HandlesDefinition } from "./_AbstractNode";

export class ExampleNode extends AbstractNode {
    static title = "Example Node";
    static category = "Example";
    static type = "example";

    static inputs: HandlesDefinition = {
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
    };
    static outputs: HandlesDefinition = {
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
    };

    public update(graphState: GraphState): void {
        super.update(graphState);

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
