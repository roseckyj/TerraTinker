import { Box } from "@chakra-ui/react";
import { useCallback } from "react";
import {
    Position,
    ReactFlowState,
    getConnectedEdges,
    useNodeId,
    useStore,
} from "reactflow";
import { VarType } from "../types/serializationTypes";
import { TypedHandle } from "./TypedHandle";

export const separator = "___";

export interface IVariableProps {
    orientation: "input" | "output";
    varType: VarType;
    param: string;
    children: string;
    nullable?: boolean;
    value?: any;
    onChange?: (value: any) => void;
}

export function Variable(props: IVariableProps) {
    const nodeId = useNodeId();
    const connectionId = `${props.param}`;

    const connections = useStore(
        useCallback(
            (s: ReactFlowState) => {
                const node = s.nodeInternals.get(nodeId!)!;
                const connectedEdges = getConnectedEdges([node], s.edges);

                return connectedEdges
                    .filter(
                        (edge) =>
                            (props.orientation === "output" &&
                                edge.source === nodeId &&
                                edge.sourceHandle === connectionId) ||
                            (props.orientation === "input" &&
                                edge.target === nodeId &&
                                edge.targetHandle === connectionId)
                    )
                    .map((edge) => ({
                        edge,
                        node: s.nodeInternals.get(
                            edge.sourceHandle === connectionId
                                ? edge.target
                                : edge.source
                        )!,
                    }));
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [nodeId, connectionId]
        )
    );

    const connected = connections.length > 0;

    if (props.orientation === "output") {
        // Right
        return (
            <Box px={4} py={1} position="relative" textAlign="right" minW={40}>
                {props.children}
                <TypedHandle
                    id={connectionId}
                    position={Position.Right}
                    isConnectable={true}
                    varType={props.varType}
                    connected={connected}
                    nullable={props.nullable}
                    value={props.value}
                    onChange={(value) =>
                        props.onChange && props.onChange(value)
                    }
                />
            </Box>
        );
    } else {
        // Left
        return (
            <Box px={4} py={1} position="relative" minW={40}>
                {props.children}
                <TypedHandle
                    id={connectionId}
                    position={Position.Left}
                    isConnectable={true}
                    varType={props.varType}
                    connected={connected}
                    nullable={props.nullable}
                    value={props.value}
                    onChange={(value) =>
                        props.onChange && props.onChange(value)
                    }
                />
            </Box>
        );
    }
}
