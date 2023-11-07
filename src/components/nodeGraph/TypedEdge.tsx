import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";
import { VarType } from "../../types/layerTypes";
import { varTypes } from "./_varTypes";

export function TypedEdge({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    data,
    selected,
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
                    strokeWidth: selected ? 5 : 2,
                    strokeDasharray: data.nullable ? "5,5" : undefined,
                }}
            />
        </>
    );
}
