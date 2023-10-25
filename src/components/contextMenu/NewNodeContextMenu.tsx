import { MenuItem, Text } from "@chakra-ui/react";
import { RefObject, useMemo } from "react";
import { ReactFlowInstance } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { GraphState } from "../../graphState/graphState";
import { nodes as nodeDefs } from "../../nodes/_nodes";
import { AbstractNode, NodeConstructor } from "../AbstractNode";
import { ContextMenu } from "./ContextMenu";

export interface INewNodeContextMenuProps {
    children: (ref: RefObject<HTMLElement>) => JSX.Element;
    reactFlow: ReactFlowInstance;
    graphState: {
        graphState: GraphState;
        updateConnections: (graphState: GraphState) => void;
        forceUpdate: () => void;
    };
}

export function NewNodeContextMenu({
    children,
    reactFlow,
    graphState: { graphState, updateConnections, forceUpdate },
}: INewNodeContextMenuProps) {
    const definitions = useMemo(
        () =>
            nodeDefs.reduce(
                (prev, value) => {
                    const stat = value as any as typeof AbstractNode;
                    if (!prev[stat.category]) {
                        prev[stat.category] = [];
                    }
                    prev[stat.category].push({
                        title: stat.title,
                        type: stat.type,
                    });
                    return prev;
                },
                {} as Record<
                    string,
                    {
                        title: string;
                        type: string;
                    }[]
                >
            ),
        []
    );

    return (
        <ContextMenu
            menuListProps={{
                w: 80,
            }}
            renderMenu={(position) => {
                return (
                    <>
                        {Object.entries(definitions).map(([group, nodes], i) =>
                            nodes.map((node, i) => (
                                <MenuItem
                                    key={i}
                                    py={0}
                                    onClick={() => {
                                        const newNode = new (nodeDefs.find(
                                            (value) =>
                                                (value as any).type ===
                                                node.type
                                        ) as NodeConstructor)({
                                            id: uuidv4(),
                                            position: reactFlow.project(
                                                position!
                                            ),
                                        });
                                        graphState.nodes.push(newNode);
                                        updateConnections(graphState);
                                        forceUpdate();
                                    }}
                                >
                                    <Text opacity={0.5}>{group}&nbsp;&gt;</Text>
                                    &nbsp;
                                    {node.title}
                                </MenuItem>
                            ))
                        )}
                    </>
                );
            }}
        >
            {children}
        </ContextMenu>
    );
}
