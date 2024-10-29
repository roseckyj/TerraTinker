import {
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Input,
    Text,
    useToast,
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
import { GraphState } from "../../graphState/graphState";
import { useGraphState } from "../../graphState/useGraphState";
import { nodes as nodeDefs } from "../../nodes/_nodes";
import { Layer, Node } from "../../types/layerTypes";
import { useUpdateConnections } from "../../useUpdateConnections";
import { deepCopy } from "../../utils/deepCopy";
import { downloadFile } from "../../utils/downloadFile";
import { useAppData } from "../DataProvider";
import { IconButtonTooltip } from "../utils/IconButtonTooltip";
import { AbstractNode, NodeData } from "./AbstractNode";
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
    const toast = useToast();

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
                        tabIndex={0}
                        onMouseDown={(e) => e.preventDefault()}
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
                        onKeyDown={async (e) => {
                            const CLIPBOARD_PREFIX = "$TERRATINKER:";

                            // Delete
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

                            // Copy
                            if (e.key === "c" && e.ctrlKey) {
                                const selectedNodes = flow
                                    .getNodes()
                                    .filter((node) => node.selected)
                                    .reduce(
                                        (acc, node) =>
                                            (node.data as NodeData).node
                                                ? {
                                                      ...acc,
                                                      [node.id]: (
                                                          node.data as NodeData
                                                      ).node.serialize(),
                                                  }
                                                : acc,
                                        {} as Record<string, Node>
                                    );

                                const toBeCopied =
                                    CLIPBOARD_PREFIX +
                                    JSON.stringify(selectedNodes);
                                navigator.clipboard.writeText(toBeCopied);

                                toast({
                                    title: "Copied to clipboard",
                                    description: `${
                                        Object.keys(selectedNodes).length
                                    } nodes copied to clipboard`,
                                    status: "success",
                                });
                            }

                            // Cut
                            if (e.key === "x" && e.ctrlKey) {
                                const selectedNodes = flow
                                    .getNodes()
                                    .filter((node) => node.selected)
                                    .reduce(
                                        (acc, node) =>
                                            (node.data as NodeData).node
                                                ? {
                                                      ...acc,
                                                      [node.id]: (
                                                          node.data as NodeData
                                                      ).node.serialize(),
                                                  }
                                                : acc,
                                        {} as Record<string, Node>
                                    );

                                const toBeCopied =
                                    CLIPBOARD_PREFIX +
                                    JSON.stringify(selectedNodes);
                                navigator.clipboard.writeText(toBeCopied);

                                flow.deleteElements({
                                    nodes: flow
                                        .getNodes()
                                        .filter((node) => node.selected),
                                });

                                toast({
                                    title: "Cut to clipboard",
                                    description: `${
                                        Object.keys(selectedNodes).length
                                    } nodes cut to clipboard`,
                                    status: "success",
                                });

                                forceUpdate();
                            }

                            // Paste
                            if (e.key === "v" && e.ctrlKey) {
                                const text =
                                    await navigator.clipboard.readText();

                                if (!text.startsWith(CLIPBOARD_PREFIX)) return;

                                const copiedNodes = JSON.parse(
                                    text.slice(CLIPBOARD_PREFIX.length)
                                ) as Record<string, Node>;

                                const idMapping: Record<string, string> = {};

                                // Copy the nodes
                                const newNodes = Object.entries(copiedNodes)
                                    .map(([id, node]) => {
                                        const newNode = deepCopy<Node>(node);
                                        const newId = v4();
                                        idMapping[id] = newId;
                                        return GraphState.deserializeNode(
                                            newNode,
                                            newId
                                        );
                                    })
                                    .filter(
                                        (node) => node !== null
                                    ) as Array<AbstractNode>;

                                // Map input ids to new ids
                                newNodes.forEach((node) => {
                                    Object.entries(node.inputState).forEach(
                                        ([key, input]) => {
                                            if (input.nodeId) {
                                                if (idMapping[input.nodeId]) {
                                                    input.nodeId =
                                                        idMapping[input.nodeId];
                                                }
                                            }
                                        }
                                    );
                                });

                                // Shift the nodes to the center of the screen
                                const bbox =
                                    ref!.current!.getBoundingClientRect();

                                const viewport = flow.project({
                                    x: bbox.width / 2,
                                    y: bbox.height / 2,
                                });
                                const [minX, minY, maxX, maxY] =
                                    newNodes.reduce(
                                        ([minX, minY, maxX, maxY], node) => {
                                            const x = node.position.x;
                                            const y = node.position.y;
                                            return [
                                                Math.min(minX, x),
                                                Math.min(minY, y),
                                                Math.max(maxX, x),
                                                Math.max(maxY, y),
                                            ];
                                        },
                                        [
                                            Infinity,
                                            Infinity,
                                            -Infinity,
                                            -Infinity,
                                        ]
                                    );

                                const meanX = (maxX + minX) / 2;
                                const meanY = (maxY + minY) / 2;

                                // Shift so that the mean is at the center of the screen
                                const shiftX = viewport.x - meanX;
                                const shiftY = viewport.y - meanY;

                                newNodes.forEach((node) => {
                                    node.position.x += shiftX;
                                    node.position.y += shiftY;
                                });

                                // Add new nodes to the graph
                                graphState.nodes.push(...newNodes);

                                toast({
                                    title: "Pasted nodes",
                                    description: `${newNodes.length} nodes pasted from the clipboard`,
                                    status: "success",
                                });

                                // Force update
                                forceUpdate();

                                // Select only the new nodes
                                // TODO: This would have to wait for the nodes to be inserted into the "nodes" array
                                const newNodeIds = newNodes.map(
                                    (node) => node.id
                                );
                                nodes.forEach((node) => {
                                    node.selected = newNodeIds.includes(
                                        node.id
                                    );
                                });
                            }
                        }}
                    >
                        <Panel position="top-right">
                            <Flex
                                direction="row"
                                justifyItems="center"
                                bg="gray.800"
                                m={-4}
                                ml={12}
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
                                                    display={{
                                                        base: "none",
                                                        md: "flex",
                                                    }}
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
                                                    display={{
                                                        base: "none",
                                                        md: "flex",
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
