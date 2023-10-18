import { NodeProps } from "reactflow";
import { Variable } from "../components/Variable";
import { Node } from "../types/graphTypes";
import { GenericNode } from "./_GenericNode";
import { HandlesDefinition, NodeDefinition } from "./_nodes";

/**
 *
 */

const title = "Contains";
const category = "geometry";

const inputs: HandlesDefinition = (node) => ({
    haystack: {
        type: "geometry",
        title: "Haystack",
    },
    needle: {
        type: "geometry",
        title: "Needle",
    },
});
const outputs: HandlesDefinition = (node) => ({
    out: {
        type: "boolean",
        title: "Contains",
    },
});

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

export const contains: NodeDefinition = {
    component: Component,
    title,
    category,
    inputs,
    outputs,
};
