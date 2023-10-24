import {
    Box,
    Button,
    Center,
    Flex,
    Menu,
    MenuGroup,
    MenuItem,
    MenuList,
    Portal,
    Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    EdgeTypes,
    Panel,
    useReactFlow,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { Edge } from "./components/Edge";
import { useGraphState } from "./graphState/useGraphState";
import { AbstractNode } from "./nodes/_AbstractNode";
import { nodes as nodeDefs } from "./nodes/_nodes";
import { Data } from "./types/serializationTypes";

export interface INodeGraphProps {
    data: Data;
    onSave?: (data: Data) => void;
}

export function NodeGraph({ data, onSave }: INodeGraphProps) {
    const {
        edges,
        nodes,
        onConnect,
        onEdgesChange,
        onNodesChange,
        graphState,
        forceUpdate,
        lastChange,
    } = useGraphState(data);
    const [savedAt, setSavedAt] = useState(lastChange);
    const [contextMenuPosition, setContentMenuPosition] = useState<null | {
        x: number;
        y: number;
    }>(null);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const flow = useReactFlow();

    const edgeTypes = useMemo<EdgeTypes>(
        () => ({
            variable: Edge,
        }),
        []
    );

    const nodeTypes = useMemo(
        () =>
            nodeDefs.reduce(
                (prev, value) => ({
                    ...prev,
                    [(value as any).type]: (value as any).Component,
                }),
                {} as Record<string, any>
            ),
        []
    );

    // useEffect(
    //     () => console.log(JSON.stringify(graphState.serialize(), undefined, 4)),
    //     [graphState, updateMe]
    // );

    return (
        <Box position="fixed" inset="0" overflow="hidden">
            <Portal>
                <Center
                    position="fixed"
                    zIndex="overlay"
                    inset={0}
                    pointerEvents={contextMenuOpen ? "all" : "none"}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenuOpen(false);
                    }}
                >
                    <Menu
                        isOpen={contextMenuOpen}
                        onClose={() => setContextMenuOpen(false)}
                    >
                        <MenuList
                            onAnimationEnd={(e) => {
                                const menu =
                                    document.querySelector("[role=menu]")!;
                                (menu as HTMLDivElement).focus();
                            }}
                            position="fixed"
                            top={`${contextMenuPosition?.y}px`}
                            left={`${contextMenuPosition?.x}px`}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setContextMenuOpen(false);
                            }}
                        >
                            {Object.entries(
                                nodeDefs.reduce(
                                    (prev, value) => {
                                        const stat =
                                            value as any as typeof AbstractNode;
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
                                )
                            ).map(([group, nodes]) => (
                                <MenuGroup key={group} title={group}>
                                    {nodes.map((node, i) => (
                                        <MenuItem
                                            key={i}
                                            onClick={() => {
                                                const newNode =
                                                    new (nodeDefs.find(
                                                        (value) =>
                                                            (value as any)
                                                                .type ===
                                                            node.type
                                                    ) as any)(
                                                        uuidv4(),
                                                        flow.project(
                                                            contextMenuPosition!
                                                        )
                                                    );
                                                graphState.nodes.push(newNode);
                                                forceUpdate();
                                                setContextMenuOpen(false);
                                            }}
                                        >
                                            {node.title}
                                        </MenuItem>
                                    ))}
                                </MenuGroup>
                            ))}
                        </MenuList>
                    </Menu>
                </Center>
            </Portal>
            <Box
                as={ReactFlow}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                bg="#1D1D1D"
                color="#ffffff"
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setContentMenuPosition({
                        x: e.clientX,
                        y: e.clientY,
                    });
                    setContextMenuOpen(true);
                }}
                fitView
            >
                <Panel position="top-right">
                    <Flex direction="row" alignItems="center">
                        <Text mr="4">
                            {lastChange === savedAt
                                ? "Saved"
                                : "Unsaved changes"}
                        </Text>
                        <Button
                            colorScheme="blue"
                            isDisabled={lastChange === savedAt}
                            onClick={() => {
                                onSave?.(data);
                                setSavedAt(lastChange);
                            }}
                        >
                            Save
                        </Button>
                    </Flex>
                </Panel>
                <Controls position="top-left" />
                <Background
                    variant={BackgroundVariant.Dots}
                    color="#ffffff20"
                />
            </Box>
        </Box>
    );
}
