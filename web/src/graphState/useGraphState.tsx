import { useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useReducer, useState } from "react";
import {
    Connection,
    EdgeChange,
    NodeChange,
    Edge as ReactFlowEdge,
    Node as ReactFlowNode,
    useStoreApi,
    useUpdateNodeInternals,
} from "reactflow";
import { NodeData } from "../components/nodeGraph/AbstractNode";
import {
    flowInId,
    flowOutId,
    flowStartNodeId,
} from "../components/nodeGraph/FlowHandles";
import { varTypes } from "../components/nodeGraph/_varTypes";
import { GraphState } from "../graphState/graphState";
import { Layer } from "../types/layerTypes";
import { useUpdateConnections } from "../useUpdateConnections";

export function useGraphState(data: Layer, locked: boolean) {
    const [version, forceUpdate] = useReducer((x) => x + 1, 0);
    const [lastChange, setDirty] = useReducer(
        () => new Date().getTime(),
        new Date().getTime()
    );
    const updateConnections = useUpdateConnections();
    const toast = useToast();
    const graphState = useMemo<GraphState>(() => {
        const state = new GraphState();
        state.deserialize(data, toast);
        return state;
        // Data removed from next line in order to prevent reloading (acts as defaultValue now)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toast]);
    const updateNodeInternals = useUpdateNodeInternals();
    const store = useStoreApi();

    useEffect(() => {
        // On load
        updateConnections(graphState);
        reloadNodes();
        reloadEdges();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [graphState]);

    useEffect(() => {
        // On force update
        if (version > 0) {
            setDirty();
            updateNodeInternals(nodes.map((node) => node.id));
            reloadNodes();
            reloadEdges();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [version]);

    // Cache edges and nodes
    const [nodes, setNodes] = useState<ReactFlowNode[]>([]);
    const [edges, setEdges] = useState<ReactFlowEdge[]>([]);

    // Rebuild the nodes
    const reloadNodes = () => {
        const newNodes = graphState.nodes.map((node) => ({
            id: node.id,
            type: (node.constructor as any).type,
            position: node.position,
            data: {
                version,
                node,
                forceUpdate: forceUpdate,
                locked,
                updateConnections: () => {
                    updateConnections(graphState);
                    forceUpdate();
                },
            } as NodeData,
        }));

        const allNodes = [
            ...newNodes,
            {
                id: flowStartNodeId,
                type: "flowStart",
                position: {
                    x: graphState.flowStartLocation[0],
                    y: graphState.flowStartLocation[1],
                },
                data: {
                    locked,
                },
            },
        ] as ReactFlowNode[];

        allNodes.forEach((node, i) => {
            const found = nodes.find((n) => n.id === node.id);

            if (found) {
                allNodes[i].selected = found.selected;
            }
        });

        setNodes(allNodes);
    };

    // Rebuild the edges
    const reloadEdges = () => {
        const typedEdges = graphState.nodes
            .map(
                (node) =>
                    Object.entries(node.inputState)
                        .filter(([, value]) => value.nodeId && value.handleId)
                        .map(([key, value]) => {
                            const source = graphState.nodes.find(
                                (node) => node.id === value.nodeId
                            )!;

                            if (!source) {
                                toast({
                                    title: "Edge source not found",
                                    description: `No source node found for edge with target ${node.id} (${key}), reseting to default value.`,
                                    status: "warning",
                                });
                                node.inputState[key] = {
                                    value: varTypes[node.inputs[key].type]
                                        .default,
                                    nodeId: null,
                                    handleId: null,
                                    nullable: false,
                                };
                                return null;
                            }

                            return {
                                id: `${node.id}#${key}`,
                                type: "variable",
                                source: value.nodeId,
                                sourceHandle: value.handleId,
                                target: node.id,
                                targetHandle: key,
                                data: {
                                    nullable: value.nullable,
                                    varType: node.inputs[key].type,
                                },
                            } as ReactFlowEdge;
                        })
                        .filter((x) => x !== null) as ReactFlowEdge[]
            )
            .flat();

        const flowEdges = graphState.nodes
            .map((node) => {
                if (node.flowOrder === null) return null;
                const source = graphState.nodes.find(
                    (node2) => node2.flowOrder === node.flowOrder! - 1
                );

                if (!source)
                    return {
                        id: `${node.id}#${flowInId}`,
                        type: "flow",
                        source: flowStartNodeId,
                        sourceHandle: flowOutId,
                        target: node.id,
                        targetHandle: flowInId,
                    } as ReactFlowEdge;

                return {
                    id: `${node.id}#${flowInId}`,
                    type: "flow",
                    source: source.id,
                    sourceHandle: flowOutId,
                    target: node.id,
                    targetHandle: flowInId,
                } as ReactFlowEdge;
            })
            .filter((x) => x !== null) as ReactFlowEdge[];

        const allEdges = [...typedEdges, ...flowEdges];

        allEdges.forEach((edge, i) => {
            const found = edges.find((e) => e.id === edge.id);

            if (found) {
                allEdges[i].selected = found.selected;
            }
        });

        setEdges(allEdges);
    };

    // Soft update, do not rebuild the data
    const updateNodes = () => {
        setNodes([...nodes]);
    };
    const updateEdges = () => {
        setEdges([...edges]);
    };

    return {
        lastChange,
        graphState,
        forceUpdate,
        version,
        nodes,
        edges,
        onNodesChange: async (changes: NodeChange[]) => {
            changes.forEach(async (change) => {
                switch (change.type) {
                    case "position":
                        if (change.position) {
                            if (change.id === flowStartNodeId) {
                                graphState.flowStartLocation = [
                                    change.position.x,
                                    change.position.y,
                                ];
                            } else {
                                graphState.nodes.find(
                                    (node) => node.id === change.id
                                )!.position = change.position;
                            }
                            nodes.find(
                                (node) => node.id === change.id
                            )!.position = change.position;
                        }
                        if (change.dragging) {
                            updateNodes(); // Only soft update needed
                            setDirty(); // Soft update does not trigger a save
                        } else {
                            forceUpdate(); // Full update needed
                            // await forAnimationFrame();
                            // nodes.find(
                            //     (node) => node.id === change.id
                            // )!.selected = true;
                            // updateNodes();
                        }
                        break;
                    case "remove":
                        if (change.id === flowStartNodeId) {
                            toast({
                                title: "Invalid action",
                                description:
                                    "The flow start node cannot be removed.",
                                status: "warning",
                            });
                        } else {
                            graphState.nodes = graphState.nodes.filter(
                                (node) => node.id !== change.id
                            );

                            forceUpdate();
                        }
                        break;

                    case "select":
                        nodes.find((node) => node.id === change.id)!.selected =
                            change.selected;
                        updateNodes();
                        break;
                    default:
                    // console.log(change);
                }
                // console.log(change);
            });
        },
        onEdgesChange: (changes: EdgeChange[]) => {
            changes.forEach((change) => {
                switch (change.type) {
                    case "add":
                        // Handled in onConnect
                        break;
                    case "remove":
                        const [nodeId, inputId] = change.id.split("#");
                        const node = graphState.nodes.find(
                            (node) => node.id === nodeId
                        )!;
                        if (inputId === flowInId) {
                            // Set flowOrder of all following nodes to null
                            const follwoingNodes = graphState.nodes
                                .filter((node) => node.flowOrder !== null)
                                .sort((a, b) => a.flowOrder! - b.flowOrder!)
                                .slice(node.flowOrder!);
                            follwoingNodes.forEach((node) => {
                                node.flowOrder = null;
                            });
                        } else {
                            const def = node.inputState[inputId];
                            if (def) {
                                def.handleId = null;
                                def.nodeId = null;
                                def.nullable = false;
                            }
                        }
                        forceUpdate();
                        updateConnections(graphState);
                        break;
                    case "select":
                        edges.find((edge) => edge.id === change.id)!.selected =
                            change.selected;
                        updateEdges();
                        break;
                    default:
                    // console.log(change);
                }
            });
        },
        onConnect: (connection: Connection) => {
            const sourceNode = graphState.nodes.find(
                (node) => node.id === connection.source
            );
            const targetNode = graphState.nodes.find(
                (node) => node.id === connection.target
            )!;

            // Handle flow edge
            if (
                connection.sourceHandle === flowOutId &&
                connection.targetHandle === flowInId
            ) {
                const sortedNodes = graphState.nodes
                    .filter((node) => node.flowOrder !== null)
                    .sort((a, b) => a.flowOrder! - b.flowOrder!);
                const sourceFlowOrder = sourceNode ? sourceNode.flowOrder! : -1;
                const targetFlowOrder = targetNode.flowOrder!;

                if (sourceNode && sourceNode.flowOrder === null) {
                    // === CASE 0: Source is not in the flow ===
                    toast({
                        title: "Invalid flow connection",
                        description:
                            "The source node is not a part of the flow.",
                        status: "warning",
                    });
                    return;
                }

                if (targetNode.flowOrder === null) {
                    // === CASE 1: Target is not in the flow ===
                    // Shift all following nodes by one
                    sortedNodes
                        .filter((node) => node.flowOrder! > sourceFlowOrder)
                        .forEach((node) => {
                            node.flowOrder! += 1;
                        });
                    targetNode.flowOrder = sourceFlowOrder + 1;
                    forceUpdate();
                    return;
                }

                if (targetFlowOrder > sourceFlowOrder) {
                    // === CASE 2: Target is after source ===
                    // Remove all intermediate nodes from the flow
                    sortedNodes
                        .filter(
                            (node) =>
                                node.flowOrder! > sourceFlowOrder &&
                                node.flowOrder! < targetFlowOrder
                        )
                        .forEach((node) => {
                            node.flowOrder = null;
                        });
                    // Set target and following nodes to source flow order + 1
                    sortedNodes
                        .filter(
                            (node) => node.flowOrder! >= targetNode.flowOrder!
                        )
                        .forEach((node, i) => {
                            node.flowOrder! = sourceFlowOrder + i + 1;
                        });
                    forceUpdate();
                    return;
                } else {
                    // === CASE 3: Target is before source ===
                    // Set source to target flow order and shift all intermediate nodes by one
                    sortedNodes
                        .filter(
                            (node) =>
                                node.flowOrder! >= targetFlowOrder &&
                                node.flowOrder! < sourceFlowOrder
                        )
                        .forEach((node) => {
                            node.flowOrder! += 1;
                        });
                    sourceNode!.flowOrder = targetFlowOrder;
                    forceUpdate();
                    return;
                }
            }
            if (
                connection.sourceHandle === flowOutId ||
                connection.targetHandle === flowInId
            ) {
                toast({
                    title: "Invalid connection",
                    description:
                        "Flow edges can only be connected to other flow edges.",
                    status: "warning",
                });
                return;
            }

            // Handle typed edge
            const sourceOutput = sourceNode!.outputs[connection.sourceHandle!];
            const targetInput = targetNode.inputs[connection.targetHandle!];
            if (sourceOutput.type !== targetInput.type) {
                toast({
                    title: "Type mismatch",
                    description:
                        "The types of the source and target do not match.",
                    status: "warning",
                });
                return;
            }
            targetNode.inputState[connection.targetHandle!] = {
                value: targetNode.inputState[connection.targetHandle!].value,
                nodeId: connection.source,
                handleId: connection.sourceHandle!,
                nullable: false,
            };

            const isOkey = updateConnections(graphState);
            if (!isOkey) {
                // There is a loop, we do not allow the connection
                console.warn("Loop detected, not connecting");
                toast({
                    title: "Cyclic connection",
                    description:
                        "This connection would create a loop, which is not allowed.",
                    status: "warning",
                });
                targetNode.inputState[connection.targetHandle!] = {
                    value: targetNode.inputState[connection.targetHandle!]
                        .value,
                    nodeId: null,
                    handleId: null,
                    nullable: false,
                };
            }
            forceUpdate();
        },
    };
}
