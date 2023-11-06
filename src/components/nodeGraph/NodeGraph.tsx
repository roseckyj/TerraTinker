import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { RefObject, useMemo, useState } from "react";
import {
    BiCrosshair,
    BiDownload,
    BiMinus,
    BiPlus,
    BiSave,
} from "react-icons/bi";
import ReactFlow, {
    Background,
    BackgroundVariant,
    EdgeTypes,
    Panel,
    useReactFlow,
} from "reactflow";
import { useGraphState } from "../../graphState/useGraphState";
import { nodes as nodeDefs } from "../../nodes/_nodes";
import { Data } from "../../types/serializationTypes";
import { useUpdateConnections } from "../../useUpdateConnections";
import { downloadFile } from "../../utils/downloadFile";
import { FlowEdge } from "./FlowEdge";
import { FlowStart } from "./FlowStartNode";
import { TypedEdge } from "./TypedEdge";
import { NewNodeContextMenu } from "./contextMenu/NewNodeContextMenu";

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
    const flow = useReactFlow();
    const updateConnections = useUpdateConnections();

    const edgeTypes = useMemo<EdgeTypes>(
        () => ({
            variable: TypedEdge,
            flow: FlowEdge,
        }),
        []
    );

    const nodeTypes = useMemo(
        () => ({
            ...nodeDefs.reduce(
                (prev, value) => ({
                    ...prev,
                    [(value as any).type]: (value as any).Component,
                }),
                {} as Record<string, any>
            ),
            flowStart: FlowStart,
        }),
        []
    );

    // useEffect(
    //     () => console.log(JSON.stringify(graphState.serialize(), undefined, 4)),
    //     [graphState, updateMe]
    // );

    const minZoom = 0.1;
    const maxZoom = 1.5;

    return (
        <Box w="full" h="full" overflow="hidden">
            <NewNodeContextMenu
                reactFlow={flow}
                graphState={{ graphState, updateConnections, forceUpdate }}
            >
                {(ref: RefObject<HTMLElement>) => (
                    <Box
                        ref={ref as RefObject<HTMLDivElement>}
                        as={ReactFlow}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        bg="gray.800"
                        color="#ffffff"
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        fitView
                        minZoom={minZoom}
                        maxZoom={maxZoom}
                    >
                        <Panel position="top-right">
                            <Flex direction="row" alignItems="center">
                                <Text mr="4">
                                    {lastChange === savedAt
                                        ? "Saved"
                                        : "Unsaved changes"}
                                </Text>
                                <IconButton
                                    aria-label="Save"
                                    icon={<BiSave />}
                                    colorScheme="blue"
                                    isDisabled={lastChange === savedAt}
                                    mr="2"
                                    onClick={() => {
                                        onSave?.(graphState.serialize());
                                        setSavedAt(lastChange);
                                    }}
                                />
                                <IconButton
                                    aria-label="Save"
                                    icon={<BiDownload />}
                                    onClick={() => {
                                        downloadFile(
                                            new File(
                                                [
                                                    JSON.stringify(
                                                        graphState.serialize()
                                                    ),
                                                ],
                                                "graph.json",
                                                { type: "text/plain" }
                                            )
                                        );
                                    }}
                                />
                            </Flex>
                        </Panel>
                        <Panel position="top-left">
                            <Flex direction="column" alignItems="center">
                                <IconButton
                                    aria-label="Zoom in"
                                    icon={<BiPlus />}
                                    onClick={() => {
                                        flow.zoomIn();
                                    }}
                                    borderBottomRadius={0}
                                />
                                <IconButton
                                    aria-label="Zoom out"
                                    icon={<BiMinus />}
                                    onClick={() => {
                                        flow.zoomOut();
                                        console.log(flow.getZoom());
                                    }}
                                    borderTopRadius={0}
                                    mb={2}
                                />
                                <IconButton
                                    aria-label="Fit view"
                                    icon={<BiCrosshair />}
                                    onClick={() => {
                                        flow.fitView();
                                    }}
                                />
                            </Flex>
                        </Panel>
                        <Background
                            variant={BackgroundVariant.Dots}
                            color="#ffffff20"
                        />
                    </Box>
                )}
            </NewNodeContextMenu>
        </Box>
    );
}
