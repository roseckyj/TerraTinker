import { useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useReducer, useState } from "react";
import {
    Connection,
    EdgeChange,
    NodeChange,
    Edge as ReactFlowEdge,
    Node as ReactFlowNode,
} from "reactflow";
import { NodeData } from "../components/AbstractNode";
import { varTypes } from "../components/_varTypes";
import { GraphState } from "../graphState/graphState";
import { Data } from "../types/serializationTypes";
import { useUpdateConnections } from "../useUpdateConnections";

export function useGraphState(data: Data) {
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
    }, [data, toast]);

    useEffect(() => {
        // On load
        reloadNodes();
        reloadEdges();
        updateConnections(graphState);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [graphState]);

    useEffect(() => {
        // On force update
        setDirty();
        reloadNodes();
        reloadEdges();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [version]);

    // Cache edges and nodes
    const [nodes, setNodes] = useState<ReactFlowNode[]>([]);
    const [edges, setEdges] = useState<ReactFlowEdge[]>([]);

    // Rebuild the nodes
    const reloadNodes = () => {
        setNodes(
            graphState.nodes.map((node) => ({
                id: node.id,
                type: (node.constructor as any).type,
                position: node.position,
                data: {
                    version,
                    node,
                    forceUpdate,
                } as NodeData,
            }))
        );
    };

    // Rebuild the edges
    const reloadEdges = () => {
        setEdges(
            graphState.nodes
                .map(
                    (node) =>
                        Object.entries(node.inputState)
                            .filter(
                                ([, value]) => value.nodeId && value.handleId
                            )
                            .map(([key, value]) => {
                                const source = graphState.nodes.find(
                                    (node) => node.id === value.nodeId
                                )!;

                                if (!source) {
                                    toast({
                                        title: "Edge source not found",
                                        description: `No source node found for edge with target ${node.id} (${key}), reseting to default value.`,
                                        status: "error",
                                        duration: 6000,
                                        isClosable: true,
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
                .flat()
        );
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
        onNodesChange: (changes: NodeChange[]) => {
            changes.forEach((change) => {
                switch (change.type) {
                    case "position":
                        if (change.position) {
                            graphState.nodes.find(
                                (node) => node.id === change.id
                            )!.position = change.position;

                            nodes.find(
                                (node) => node.id === change.id
                            )!.position = change.position;
                        }
                        updateNodes(); // Only soft update needed
                        setDirty(); // Soft update does not trigger a save
                        break;
                    case "remove":
                        graphState.nodes = graphState.nodes.filter(
                            (node) => node.id !== change.id
                        );
                        forceUpdate();
                        break;

                    case "select":
                        nodes.find((node) => node.id === change.id)!.selected =
                            change.selected;
                        updateNodes();
                        break;
                    default:
                    // console.log(change);
                }
            });
        },
        onEdgesChange: (changes: EdgeChange[]) => {
            changes.forEach((change) => {
                switch (change.type) {
                    case "add":
                        // Handled in onConnect
                        break;
                    case "remove":
                        const def = graphState.nodes.find(
                            (node) => node.id === change.id.split("#")[0]
                        )!.inputState[change.id.split("#")[1]];
                        def.handleId = null;
                        def.nodeId = null;
                        def.nullable = false;
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
            )!;
            const targetNode = graphState.nodes.find(
                (node) => node.id === connection.target
            )!;
            const sourceOutput = sourceNode.outputs[connection.sourceHandle!];
            const targetInput = targetNode.inputs[connection.targetHandle!];
            if (sourceOutput.type !== targetInput.type) {
                toast({
                    title: "Type mismatch",
                    description:
                        "The types of the source and target do not match.",
                    status: "error",
                    duration: 6000,
                    isClosable: true,
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
                    status: "error",
                    duration: 6000,
                    isClosable: true,
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
