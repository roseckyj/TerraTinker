import { Box, Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { BiSolidCube } from "react-icons/bi";
import defaultData from "../data/default.json";
import { Data } from "../types/serializationTypes";
import { Map } from "./map/Map";
import { NodeGraph } from "./nodeGraph/NodeGraph";

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
            >
                <Icon as={BiSolidCube} mr={4} fontSize="3xl" />
                <Text fontSize="2xl" fontWeight="bold">
                    Minecraft Map Maker
                </Text>
            </HStack>
            <Flex direction="row" flexGrow={1}>
                <VStack
                    w={64}
                    borderRightStyle="solid"
                    borderRightWidth={2}
                    borderRightColor="gray.800"
                    alignItems="stretch"
                    spacing={0}
                >
                    <Box
                        px={6}
                        py={4}
                        borderBottomStyle="solid"
                        borderBottomWidth={2}
                        borderBottomColor="gray.800"
                        bg={stage === "select" ? "blue.800" : undefined}
                        onClick={() => setStage("select")}
                        cursor="pointer"
                    >
                        <Text fontWeight="bold">Select area</Text>
                    </Box>
                    <Box
                        px={6}
                        py={4}
                        borderBottomStyle="solid"
                        borderBottomWidth={2}
                        borderBottomColor="gray.800"
                        bg={stage === "layers" ? "blue.800" : undefined}
                        onClick={() => setStage("layers")}
                        cursor="pointer"
                    >
                        <Text fontWeight="bold">Create layers</Text>
                    </Box>
                    <Box
                        px={6}
                        py={4}
                        borderBottomStyle="solid"
                        borderBottomWidth={2}
                        borderBottomColor="gray.800"
                        bg={stage === "publish" ? "blue.800" : undefined}
                        onClick={() => setStage("publish")}
                        cursor="pointer"
                    >
                        <Text fontWeight="bold">Publish</Text>
                    </Box>
                </VStack>
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
