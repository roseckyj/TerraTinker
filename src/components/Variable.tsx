import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import {
    Position,
    ReactFlowState,
    getConnectedEdges,
    useNodeId,
    useStore,
} from "reactflow";
import { VarType } from "../types/graphTypes";
import { TypedHandle } from "./TypedHandle";
import { varTypes } from "./_varTypes";

export const separator = "___";

export interface IVariableProps {
    orientation: "input" | "output";
    varType: VarType;
    param: string;
    children: string;
    nullable?: boolean;
    value?: any;
}

export function Variable(props: IVariableProps) {
    const type = varTypes[props.varType];
    const nodeId = useNodeId();
    const [value, setvalue] = useState<any>(
        props.value === undefined ? type.default : props.value
    );

    useEffect(() => {
        setvalue(props.value === undefined ? type.default : props.value);
    }, [props.value, type.default]);

    const connectionId = `${props.param}`;

    const connections = useStore(
        useCallback(
            (s: ReactFlowState) => {
                const node = s.nodeInternals.get(nodeId!)!;
                const connectedEdges = getConnectedEdges([node], s.edges);

                return connectedEdges
                    .filter(
                        (edge) =>
                            edge.sourceHandle === connectionId ||
                            edge.targetHandle === connectionId
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
                    value={value}
                    onChange={(value) => setvalue(value)}
                />
            </Box>
        );
    } else {
        // Left
        return (
            <Box px={4} py={1} position="relative">
                {props.children}
                <TypedHandle
                    id={connectionId}
                    position={Position.Left}
                    isConnectable={true}
                    varType={props.varType}
                    connected={connected}
                    nullable={
                        props.nullable ||
                        connections.some((connection) => connection.node.type) // TODO
                    }
                    value={value}
                    onChange={(value) => setvalue(value)}
                />
            </Box>
        );
    }
}
