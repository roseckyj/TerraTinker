import {
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Input,
    Text,
} from "@chakra-ui/react";
import { RefObject, useEffect, useMemo } from "react";
import {
    BiCopyAlt,
    BiCrosshair,
    BiExport,
    BiHide,
    BiMinus,
    BiPlus,
} from "react-icons/bi";
import ReactFlow, {
    Background,
    BackgroundVariant,
    EdgeTypes,
    Panel,
    useReactFlow,
} from "reactflow";
import { v4 } from "uuid";
import { useGraphState } from "../../graphState/useGraphState";
import { nodes as nodeDefs } from "../../nodes/_nodes";
import { Layer } from "../../types/layerTypes";
import { useUpdateConnections } from "../../useUpdateConnections";
import { deepCopy } from "../../utils/deepCopy";
import { downloadFile } from "../../utils/downloadFile";
import { useAppData } from "../DataProvider";
import { IconButtonTooltip } from "../utils/IconButtonTooltip";
import { FlowEdge } from "./FlowEdge";
import { FlowStart } from "./FlowStartNode";
import { TypedEdge } from "./TypedEdge";
import { NewNodeContextMenu } from "./contextMenu/NewNodeContextMenu";

export interface INodeGraphProps {
    data: Layer;
    onChange?: (data: Layer) => void;
    readonly?: boolean;
    bg?: string;
}

export function NodeGraphComponent({
    data,
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
        version,
    } = useGraphState(data, !!readonly);
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
        () => {
            version > 0 && onChange && onChange(graphState.serialize());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [version, onChange]
    );

    const noop = () => {};
    const { data: appData, setData: setAppData } = useAppData();

    const minZoom = 0.1;
    const maxZoom = 1.5;

    return (
        <Box w="full" h="full" overflow="hidden">
            <NewNodeContextMenu
                reactFlow={flow}
                graphState={{ graphState, updateConnections, forceUpdate }}
                disabled={readonly}
            >
                {(ref, openContextMenu) => (
                    <Box
                        ref={ref as RefObject<HTMLDivElement>}
                        as={ReactFlow}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={readonly ? noop : onNodesChange}
                        onEdgesChange={readonly ? noop : onEdgesChange}
                        onConnect={readonly ? noop : onConnect}
                        onConnectEnd={(event: MouseEvent | TouchEvent) => {
                            const targetIsPane = (
                                event.target as null | HTMLElement
                            )?.classList.contains("react-flow__pane");
                            if (!targetIsPane) return;

                            const mouseEvent = event as MouseEvent;
                            if (mouseEvent.clientX || mouseEvent.clientY) {
                                openContextMenu(
                                    mouseEvent.clientX,
                                    mouseEvent.clientY
                                );
                                return;
                            }

                            const touchEvent = event as TouchEvent;
                            if (
                                touchEvent.touches[0] &&
                                (touchEvent.touches[0].clientX ||
                                    touchEvent.touches[0].clientY)
                            ) {
                                openContextMenu(
                                    touchEvent.touches[0].clientX,
                                    touchEvent.touches[0].clientY
                                );
                                return;
                            }
                        }}
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
                        <Panel position="top-right">
                            <Flex
                                direction="row"
                                justifyItems="center"
                                bg="gray.800"
                                m={-4}
                                p={4}
                            >
                                {!readonly && (
                                    <>
                                        {graphState.disabled && (
                                            <>
                                                <HStack
                                                    whiteSpace="nowrap"
                                                    py={2}
                                                    px={4}
                                                    color="red.500"
                                                    fontWeight="bold"
                                                >
                                                    <BiHide />
                                                    <Text>
                                                        This layer is disabled
                                                    </Text>
                                                </HStack>
                                                <Button
                                                    mr={8}
                                                    flexShrink={0}
                                                    onClick={() => {
                                                        graphState.disabled =
                                                            false;
                                                        forceUpdate();
                                                    }}
                                                >
                                                    Enable
                                                </Button>
                                            </>
                                        )}
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
                                    </>
                                )}
                                <IconButtonTooltip
                                    aria-label="Duplicate this layer to your project"
                                    icon={<BiCopyAlt />}
                                    onClick={() => {
                                        appData.layers.unshift(deepCopy(data));
                                        appData.layers[0].id = v4();
                                        setAppData(appData);
                                    }}
                                    mr={2}
                                />
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
