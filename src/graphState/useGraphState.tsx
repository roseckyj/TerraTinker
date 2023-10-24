import { useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useReducer, useState } from "react";
import {
    Connection,
    EdgeChange,
    NodeChange,
    Edge as ReactFlowEdge,
    Node as ReactFlowNode,
} from "reactflow";
import { varTypes } from "../components/_varTypes";
import { GraphState } from "../graphState/graphState";
import { AbstractNode, NodeData } from "../nodes/_AbstractNode";
import { Data } from "../types/serializationTypes";
import { useUpdateConnections } from "../useUpdateConnections";

export function useGraphState(data: Data) {
    const [version, forceUpdate] = useReducer((x) => x + 1, 0);
    const updateConnections = useUpdateConnections();
    const toast = useToast();
    const graphState = useMemo<GraphState>(() => {
        const state = new GraphState();
        state.deserialize(data);
        return state;
    }, [data]);

    useEffect(() => {
        // On load
        reloadNodes();
        reloadEdges();
        updateConnections(graphState);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [graphState]);

    useEffect(() => {
        // On force update
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
                .map((node) =>
                    Object.entries(node.inputState)
                        .filter(([, value]) => value.nodeId && value.handleId)
                        .map(
                            ([key, value]) =>
                                ({
                                    id: `${node.id}-${key}`,
                                    type: "variable",
                                    source: value.nodeId,
                                    sourceHandle: value.handleId,
                                    target: node.id,
                                    targetHandle: key,
                                    data: {
                                        nullable: value.nullable,
                                        varType: (
                                            node.constructor as typeof AbstractNode
                                        ).inputs[key].type,
                                    },
                                } as ReactFlowEdge)
                        )
                )
                .flat()
        );
    };

    // Soft update, do not rebuild the data
    const updateNodes = () => {
        setNodes([...nodes]);
    };

    return {
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
                        updateNodes();
                        break;
                    case "remove":
                        graphState.nodes = graphState.nodes.filter(
                            (node) => node.id !== change.id
                        );
                        forceUpdate();
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
                            (node) => node.id === change.id.split("-")[0]
                        )!.inputState[change.id.split("-")[1]];
                        def.handleId = null;
                        def.nodeId = null;
                        def.nullable = false;
                        break;
                    default:
                    // console.log(change);
                }
                forceUpdate();
            });
        },
        onConnect: (connection: Connection) => {
            const sourceNode = graphState.nodes.find(
                (node) => node.id === connection.source
            )!;
            const targetNode = graphState.nodes.find(
                (node) => node.id === connection.target
            )!;
            const sourceOutput = (sourceNode.constructor as typeof AbstractNode)
                .outputs[connection.sourceHandle!];
            const targetInput = (targetNode.constructor as typeof AbstractNode)
                .inputs[connection.targetHandle!];
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
                value: null,
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
                    value: varTypes[targetInput.type].default,
                    nodeId: null,
                    handleId: null,
                    nullable: false,
                };
            }
            forceUpdate();
        },
    };
}
