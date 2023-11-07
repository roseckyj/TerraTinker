import {
    Box,
    Flex,
    HStack,
    Icon,
    Text,
    VStack,
    useToken,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { BiRocket, BiSolidCube } from "react-icons/bi";
import defaultData from "../data/default.json";
import { Data } from "../types/serializationTypes";
import { Map } from "./map/Map";
import { MapMenuItem } from "./map/MapMenuItem";
import { MenuItem } from "./menu/MenuItem";
import { NodeGraph } from "./nodeGraph/NodeGraph";
import { NodeGraphMenuItem } from "./nodeGraph/NodeGraphMenuItem";

export interface IAppProps {}

export function App() {
    const [stage, setStage] = useState<"select" | "layers" | "publish">(
        "select"
    );

    const data = useMemo(() => {
        const stored = localStorage.getItem("data");
        let data: Data;
        if (!stored) {
            localStorage.setItem("data", JSON.stringify(defaultData));
            data = defaultData as any;
        } else {
            data = JSON.parse(stored);
        }
        return data;
    }, []);

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
                    Minecraft Map Maker
                </Text>
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
                            onClick={() => setStage("select")}
                            selected={stage === "select"}
                        />
                        <NodeGraphMenuItem
                            onClick={() => setStage("layers")}
                            selected={stage === "layers"}
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
                    {stage === "select" && <Map />}
                    {stage === "layers" && (
                        <NodeGraph
                            data={data}
                            onSave={(data) =>
                                localStorage.setItem(
                                    "data",
                                    JSON.stringify(data)
                                )
                            }
                        />
                    )}
                </Box>
            </Flex>
        </Flex>
    );
}
