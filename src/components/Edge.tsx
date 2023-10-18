import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";
import { VarType } from "../types/graphTypes";
import { varTypes } from "./_varTypes";

export function Edge({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    data,
}: EdgeProps) {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    stroke: varTypes[data.varType as VarType].color,
                    strokeWidth: 2,
                }}
            />
        </>
    );
}
