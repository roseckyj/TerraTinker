import { Handle, Position } from "reactflow";
import { AbstractNode } from "./AbstractNode";

export const flowInId = "__flow_in";
export const flowOutId = "__flow_out";
export const flowStartNodeId = "__flowStart";

export interface IFlowHandlesProps {
    node: AbstractNode;
}

export function FlowHandles({ node }: IFlowHandlesProps) {
    if (!(node.constructor as typeof AbstractNode).canBeFlow) return <></>;

    return (
        <>
            <FlowHandle type="source" />
            <FlowHandle type="target" />
        </>
    );
}

export interface IFlowHandleProps {
    type: "source" | "target";
}

export function FlowHandle({ type }: IFlowHandleProps) {
    return (
        <Handle
            type={type}
            position={type === "source" ? Position.Bottom : Position.Top}
            id={type === "source" ? flowOutId : flowInId}
            style={{
                width: "60px",
                borderRadius: "10px",
                backgroundColor: "#565656",
                border: "none",
            }}
        ></Handle>
    );
}
