import { NodeProps } from "reactflow";
import { Variable } from "../components/Variable";
import { Node } from "../types/graphTypes";
import { incremental } from "../utils/incremental";
import { GenericNode } from "./_GenericNode";
import { HandlesDefinition, NodeDefinition } from "./_nodes";

/**
 *
 */

const title = "Concatenate";
const category = "string";

const inputs: HandlesDefinition = (node) =>
    incremental(node.nodeData.numInputs, 1).reduce(
        (prev, curr) => ({
            ...prev,
            [`str${curr}`]: {
                type: "string",
                title: `Input ${curr}`,
            },
        }),
        {}
    );
const outputs: HandlesDefinition = (node) => ({
    out: {
        type: "string",
        title: "Output",
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

export const concatenate: NodeDefinition = {
    component: Component,
    title,
    category,
    inputs,
    outputs,
};
