import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";

export function FlowEdge({
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
                    stroke: selected
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,0.05)",
                    strokeWidth: 50,
                }}
            />
        </>
    );
}
