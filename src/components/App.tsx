import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Spacer,
    Text,
    VStack,
    useToast,
    useToken,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useMemo, useReducer, useState } from "react";
import { BiRocket, BiSearch, BiSolidCube } from "react-icons/bi";
import { getDefaultGeneratorData } from "../data/getDefaultGeneratorData";
import { GeneratorData } from "../types/generatorTypes";
import { Map } from "./map/Map";
import { MapMenuItem } from "./map/MapMenuItem";
import { MenuItem } from "./menu/MenuItem";
import { NodeGraph } from "./nodeGraph/NodeGraph";
import { NodeGraphMenuItem } from "./nodeGraph/NodeGraphMenuItem";
import { Preview } from "./preview/Preview";
import { Publish } from "./publish/Publish";

const localStorageKey = "generatorData";

export interface IAppProps {}

export function App() {
    const [stage, setStage] = useState<
        "select" | "layers" | "preview" | "publish"
    >("select");
    const [serverStatus, setServerStatus] = useState<{
        connected: boolean;
        queued: number;
    }>({
        connected: false,
        queued: 0,
    });

    const apiUrl = useMemo(() => {
        // Read from current url and change port to 7070
        // Eg. http://localhost:3000/McVizFrontend -> http://localhost:7070/api

        const url = new URL(window.location.href);
        url.port = "7070";
        url.pathname = "/api";
        const path = url.toString();

        console.log("API URL:", path);

        return path;
    }, []);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await axios.get(apiUrl + "/status");
                const status = response.data.status;
                const queued = response.data.queued;
                setServerStatus({
                    connected: status === "ok",
                    queued,
                });
            } catch (e) {
                setServerStatus({
                    connected: false,
                    queued: 0,
                });
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 1000);
        return () => clearInterval(interval);
    }, [apiUrl]);
    const toast = useToast();

    // Data
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const [data, setData] = useState(() => {
        const stored = localStorage.getItem(localStorageKey);
        let data: GeneratorData;
        const def = getDefaultGeneratorData();
        if (!stored) {
            data = def;
            localStorage.setItem(localStorageKey, JSON.stringify(data));
        } else {
            data = { ...def, ...JSON.parse(stored) };
        }
        return data;
    });
    const setDataAndSave = (data: GeneratorData) => {
        setData(data);
        forceUpdate();
        localStorage.setItem(localStorageKey, JSON.stringify(data));
    };

    // Map stage
    const [isSelecting, setIsSelecting] = useState(false);

    // Layers stage
    const [layerId, setLayerId] = useState<string>(data.layers[0].id);

    return (
        <Flex
            position="fixed"
            inset="0"
            direction="column"
            alignItems="stretch"
            bg="gray.900"
            color="white"
        >
            <HStack
                h={20}
                borderBottomStyle="solid"
                borderBottomWidth={2}
                borderBottomColor="gray.800"
                px={6}
                flexShrink={0}
            >
                <Icon as={BiSolidCube} mr={4} fontSize="3xl" />
                <Text fontSize="2xl" fontWeight="bold">
                    TerraTinker
                </Text>
                <Spacer />
                <HStack>
                    {serverStatus.connected ? (
                        serverStatus.queued > 0 ? (
                            <>
                                <Box
                                    rounded="full"
                                    w="0.5em"
                                    h="0.5em"
                                    bg="yellow.500"
                                />
                                <Text opacity={0.8}>
                                    Busy ({serverStatus.queued} tasks queued)
                                </Text>
                            </>
                        ) : (
                            <>
                                <Box
                                    rounded="full"
                                    w="0.5em"
                                    h="0.5em"
                                    bg="green.500"
                                />
                                <Text opacity={0.8}>Connected</Text>
                            </>
                        )
                    ) : (
                        <>
                            <Box
                                rounded="full"
                                w="0.5em"
                                h="0.5em"
                                bg="red.500"
                            />
                            <Text opacity={0.8}>Disconnected</Text>
                        </>
                    )}
                    <Button
                        colorScheme="blue"
                        leftIcon={<BiRocket />}
                        ml={6}
                        onClick={async () => {
                            try {
                                const response = await axios.post(
                                    apiUrl + "/run",
                                    JSON.stringify(data),
                                    {
                                        validateStatus: () => true,
                                    }
                                );

                                if (response.status !== 200) {
                                    toast({
                                        title: "Execution failed",
                                        description: response.data,
                                        status: "error",
                                    });
                                }
                            } catch (e) {
                                toast({
                                    title: "Network error",
                                    description:
                                        "Execution failed due to a network error",
                                    status: "error",
                                });
                            }
                        }}
                    >
                        Execute
                    </Button>
                </HStack>
            </HStack>
            <Flex
                direction="row"
                flexGrow={1}
                flexShrink={1}
                h={`calc(100vh - ${useToken("sizes", "20")})`}
            >
                <Box
                    overflowY="auto"
                    w={80}
                    h="full"
                    borderRightStyle="solid"
                    borderRightWidth={2}
                    borderRightColor="gray.800"
                >
                    <VStack w="full" alignItems="stretch" spacing={0}>
                        <MapMenuItem
                            onClick={() => {
                                setStage("select");
                                setIsSelecting(false);
                            }}
                            selected={stage === "select"}
                            data={data}
                            onChange={setDataAndSave}
                            isSelecting={isSelecting}
                            onSelectionToggle={() =>
                                setIsSelecting(!isSelecting)
                            }
                        />
                        <NodeGraphMenuItem
                            onClick={() => {
                                setStage("layers");
                            }}
                            selected={stage === "layers"}
                            data={data}
                            onChange={setDataAndSave}
                            layerId={layerId}
                            onLayerIdChange={setLayerId}
                        />
                        <MenuItem
                            icon={<BiSearch />}
                            label="Preview"
                            onClick={() => setStage("preview")}
                            selected={stage === "preview"}
                        />
                        <MenuItem
                            icon={<BiRocket />}
                            label="Publish"
                            onClick={() => setStage("publish")}
                            selected={stage === "publish"}
                        />
                    </VStack>
                </Box>

                <Box flexGrow={1} bg="gray.800">
                    {stage === "select" && (
                        <Map
                            onSelectionToggle={() =>
                                setIsSelecting(!isSelecting)
                            }
                            isSelecting={isSelecting}
                            data={data}
                            onChange={setDataAndSave}
                        />
                    )}
                    {stage === "layers" && (
                        <NodeGraph
                            key={layerId}
                            data={data.layers.find((x) => x.id === layerId)!}
                            onChange={(layer) => {
                                data.layers = data.layers.map((x) =>
                                    x.id === layer.id ? layer : x
                                );
                                setDataAndSave(data);
                            }}
                        />
                    )}
                    <Preview
                        apiUrl={apiUrl}
                        data={data}
                        hide={stage !== "preview"}
                    />
                    <Publish
                        apiUrl={apiUrl}
                        data={data}
                        hide={stage !== "publish"}
                    />
                </Box>
            </Flex>
        </Flex>
    );
}
