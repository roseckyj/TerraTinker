import { Box, Flex, IconButton, Input } from "@chakra-ui/react";
import { RefObject, useEffect, useMemo, useState } from "react";
import { BiCrosshair, BiExport, BiMinus, BiPlus, BiSave } from "react-icons/bi";
import ReactFlow, {
    Background,
    BackgroundVariant,
    EdgeTypes,
    Panel,
    useReactFlow,
} from "reactflow";
import { useGraphState } from "../../graphState/useGraphState";
import { nodes as nodeDefs } from "../../nodes/_nodes";
import { Layer } from "../../types/layerTypes";
import { useUpdateConnections } from "../../useUpdateConnections";
import { downloadFile } from "../../utils/downloadFile";
import { IconButtonTooltip } from "../utils/IconButtonTooltip";
import { FlowEdge } from "./FlowEdge";
import { FlowStart } from "./FlowStartNode";
import { TypedEdge } from "./TypedEdge";
import { NewNodeContextMenu } from "./contextMenu/NewNodeContextMenu";

export interface INodeGraphProps {
    data: Layer;
    onSave?: (data: Layer) => void;
    onChange?: (data: Layer) => void;
    readonly?: boolean;
    bg?: string;
}

export function NodeGraphComponent({
    data,
    onSave,
    onChange,
    readonly,
    bg,
}: INodeGraphProps) {
    const {
        edges,
        nodes,
        onConnect,
        onEdgesChange,
        onNodesChange,
        graphState,
        forceUpdate,
        lastChange,
    } = useGraphState(data, !!readonly);
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

    useEffect(
        () => onChange && onChange(graphState.serialize()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [lastChange, onChange]
    );

    const noop = () => {};

    const minZoom = 0.1;
    const maxZoom = 1.5;

    return (
        <Box w="full" h="full" overflow="hidden">
            <NewNodeContextMenu
                reactFlow={flow}
                graphState={{ graphState, updateConnections, forceUpdate }}
                disabled={readonly}
            >
                {(ref) => (
                    <Box
                        ref={ref as RefObject<HTMLDivElement>}
                        as={ReactFlow}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={readonly ? noop : onNodesChange}
                        onEdgesChange={readonly ? noop : onEdgesChange}
                        onConnect={readonly ? noop : onConnect}
                        bg={bg || "gray.800"}
                        color="#ffffff"
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        fitView
                        minZoom={minZoom}
                        maxZoom={maxZoom}
                        onKeyDown={(e) => {
                            if (e.key === "Delete") {
                                flow.deleteElements({
                                    nodes: flow
                                        .getNodes()
                                        .filter((node) => node.selected),
                                    edges: flow
                                        .getEdges()
                                        .filter((edge) => edge.selected),
                                });
                                forceUpdate();
                            }
                        }}
                    >
                        {!readonly && (
                            <Panel position="top-right">
                                <Flex direction="row" alignItems="center">
                                    <Input
                                        type="text"
                                        value={graphState.layerName}
                                        onChange={(e) => {
                                            graphState.layerName =
                                                e.target.value;
                                            forceUpdate();
                                        }}
                                        variant="filled"
                                        mr={2}
                                    />
                                    {onSave && (
                                        <IconButtonTooltip
                                            aria-label="Save"
                                            icon={<BiSave />}
                                            colorScheme="blue"
                                            isDisabled={lastChange === savedAt}
                                            mr="2"
                                            onClick={() => {
                                                onSave?.(
                                                    graphState.serialize()
                                                );
                                                setSavedAt(lastChange);
                                            }}
                                        />
                                    )}

                                    <IconButtonTooltip
                                        aria-label="Export layer"
                                        icon={<BiExport />}
                                        onClick={() => {
                                            downloadFile(
                                                new File(
                                                    [
                                                        JSON.stringify(
                                                            graphState.serialize()
                                                        ),
                                                    ],
                                                    `${graphState.layerName}.json`,
                                                    { type: "text/plain" }
                                                )
                                            );
                                        }}
                                    />
                                </Flex>
                            </Panel>
                        )}
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
                                <IconButtonTooltip
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
