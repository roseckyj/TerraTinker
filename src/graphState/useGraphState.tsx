import { useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useReducer } from "react";
import {
    Connection,
    EdgeChange,
    NodeChange,
    Edge as ReactFlowEdge,
} from "reactflow";
import { varTypes } from "../components/_varTypes";
import { GraphState } from "../graphState/graphState";
import { AbstractNode, NodeData } from "../nodes/_AbstractNode";
import { Data } from "../types/serializationTypes";
import { useUpdate } from "../useUpdate";

export function useGraphState(data: Data) {
    const [version, forceUpdate] = useReducer((x) => x + 1, 0);
    const updateNodes = useUpdate();
    const toast = useToast();
    const graphState = useMemo<GraphState>(() => {
        const state = new GraphState();
        state.deserialize(data);
        return state;
    }, [data]);

    useEffect(() => {
        const result = updateNodes(graphState);
        console.log("Updated", result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [graphState]);

    return {
        graphState,
        forceUpdate,
        version,
        nodes: graphState.nodes.map((node) => ({
            id: node.id,
            type: (node.constructor as any).type,
            position: node.position,
            data: {
                version,
                node,
                forceUpdate,
            } as NodeData,
        })),
        edges: graphState.nodes
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
            .flat(),
        onNodesChange: (changes: NodeChange[]) => {
            changes.forEach((change) => {
                switch (change.type) {
                    case "position":
                        if (change.position) {
                            graphState.nodes.find(
                                (node) => node.id === change.id
                            )!.position = change.position;
                        }
                        break;
                    case "remove":
                        graphState.nodes = graphState.nodes.filter(
                            (node) => node.id !== change.id
                        );
                        break;
                    default:
                        console.log(change);
                }
                forceUpdate();
            });
        },
        onEdgesChange: (changes: EdgeChange[]) => {
            changes.forEach((change) => {
                switch (change.type) {
                    case "add":
                        // Probably handled in onConnect?
                        break;
                    case "remove":
                        const def = graphState.nodes.find(
                            (node) => node.id === change.id.split("-")[0]
                        )!.inputState[change.id.split("-")[1]];
                        console.log(def);
                        def.handleId = null;
                        def.nodeId = null;
                        def.nullable = false;
                        break;
                    default:
                        console.log(change);
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

            const isOkey = updateNodes(graphState);
            console.log(isOkey);
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
