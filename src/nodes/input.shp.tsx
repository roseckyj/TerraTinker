import { NodeProps } from "reactflow";
import { Variable } from "../components/Variable";
import { Node } from "../types/graphTypes";
import { capitalize } from "../utils/capitalize";
import { GenericNode } from "./_GenericNode";
import { HandlesDefinition, NodeDefinition } from "./_nodes";

/**
 *
 */

const title = "ESRI shapefile";
const category = "input";

const inputs: HandlesDefinition = (node) => ({
    path: {
        type: "string",
        title: "Path",
    },
});
const outputs: HandlesDefinition = (node) =>
    Object.entries(node.nodeData.columns || {}).reduce(
        (prev, [key, value]) => ({
            ...prev,
            [key]: { type: value, title: capitalize(key) },
        }),
        {}
    );

function Component(props: NodeProps) {
    return (
        <GenericNode title={title} category={category}>
            {Object.entries(inputs(props.data)).map(([id, input]) => (
                <Variable
                    orientation="input"
                    varType={input.type}
                    param={id}
                    nullable={input.nullable}
                    value={
                        (props.data as Node).inputs[id].kind === "value"
                            ? ((props.data as Node).inputs[id] as any).value
                            : undefined
                    }
                >
                    {input.title}
                </Variable>
            ))}
            {Object.entries(outputs(props.data)).map(([id, input]) => (
                <Variable
                    orientation="output"
                    varType={input.type}
                    param={id}
                    nullable={input.nullable}
                >
                    {input.title}
                </Variable>
            ))}
        </GenericNode>
    );
}

export const shapeInput: NodeDefinition = {
    component: Component,
    title,
    category,
    inputs,
    outputs,
};
