import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    EdgeTypes,
    Panel,
} from "reactflow";
import { Edge } from "./components/Edge";
import { useGraphState } from "./graphState/useGraphState";
import { nodes as nodeDefs } from "./nodes/_nodes";
import { Data } from "./types/serializationTypes";

export interface INodeGraphProps {
    data: Data;
    onSave?: (data: Data) => void;
}

export function NodeGraph({ data, onSave }: INodeGraphProps) {
    const { edges, nodes, onConnect, onEdgesChange, onNodesChange, version } =
        useGraphState(data);
    const [savedVersion, setSavedVersion] = useState(version);

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
                fitView
            >
                <Panel position="top-right">
                    <Flex direction="row" alignItems="center">
                        <Text mr="4">
                            {version === savedVersion
                                ? "Saved"
                                : "Unsaved changes"}
                        </Text>
                        <Button
                            colorScheme="blue"
                            isDisabled={version === savedVersion}
                            onClick={() => {
                                onSave?.(data);
                                setSavedVersion(version);
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
