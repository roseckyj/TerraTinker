import { NodeProps } from "reactflow";
import { Variable } from "../components/Variable";
import { Node } from "../types/graphTypes";
import { GenericNode } from "./_GenericNode";
import { HandlesDefinition, NodeDefinition } from "./_nodes";

/**
 *
 */

const title = "Area";
const category = "constant";

const inputs: HandlesDefinition = (node) => ({});
const outputs: HandlesDefinition = (node) => ({
    startLat: { type: "float", title: "Start lat" },
    endLat: { type: "float", title: "End lat" },
    startLon: { type: "float", title: "Start lon" },
    endLon: { type: "float", title: "End lon" },
    startX: { type: "float", title: "Start X" },
    endX: { type: "float", title: "End X" },
    startZ: { type: "float", title: "Start Z" },
    endZ: { type: "float", title: "End Z" },
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

export const constant: NodeDefinition = {
    component: Component,
    title,
    category,
    inputs,
    outputs,
};
