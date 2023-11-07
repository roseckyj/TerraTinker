import {
    Box,
    Flex,
    HStack,
    Icon,
    Spacer,
    Text,
    VStack,
    useToken,
} from "@chakra-ui/react";
import { useReducer, useState } from "react";
import { BiRocket, BiSolidCube } from "react-icons/bi";
import { getDefaultGeneratorData } from "../data/getDefaultGeneratorData";
import { GeneratorData } from "../types/generatorTypes";
import { Map } from "./map/Map";
import { MapMenuItem } from "./map/MapMenuItem";
import { MenuItem } from "./menu/MenuItem";
import { NodeGraph } from "./nodeGraph/NodeGraph";
import { NodeGraphMenuItem } from "./nodeGraph/NodeGraphMenuItem";

const localStorageKey = "generatorData";

export interface IAppProps {}

export function App() {
    const [stage, setStage] = useState<"select" | "layers" | "publish">(
        "select"
    );

    // Data
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const [data, setData] = useState(() => {
        const stored = localStorage.getItem(localStorageKey);
        let data: GeneratorData;
        if (!stored) {
            const def = getDefaultGeneratorData();
            localStorage.setItem(localStorageKey, JSON.stringify(def));
            data = def;
        } else {
            data = JSON.parse(stored);
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
                    <Box rounded="full" w="0.5em" h="0.5em" bg="green.500" />
                    <Text opacity={0.8}>Connected</Text>
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
                            icon={<BiRocket />}
                            label="Publish"
                            onClick={() => setStage("publish")}
                            selected={stage === "publish"}
                        ></MenuItem>
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
                </Box>
            </Flex>
        </Flex>
    );
}
