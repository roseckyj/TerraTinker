import {
    Box,
    Button,
    Center,
    HStack,
    Spinner,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { BiCube, BiError, BiShow } from "react-icons/bi";
import { MinecraftViewer } from "react-minecraft-viewer";
import { forTime } from "waitasecond";
import { useApi } from "../../api/ApiProvider";
import { GeneratorData } from "../../types/generatorTypes";
import { deepCopy } from "../../utils/deepCopy";

export interface IPreviewProps {
    data: GeneratorData;
    hide: boolean;
}

export function Preview(props: IPreviewProps) {
    const [previewSession, setPreviewSession] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<GeneratorData | null>(null);
    const [previewState, setPreviewState] = useState<"running" | "ready">(
        "running"
    );
    const [error, setError] = useState<{
        title: string;
        subtitle: string;
    } | null>(null);
    const toast = useToast();
    const api = useApi();

    useEffect(() => {
        const checkStatus = async () => {
            if (previewSession) {
                const response = await api.get(`/session/${previewSession}`);
                if (
                    response &&
                    response.status === 200 &&
                    response.data.state === "finished"
                ) {
                    setPreviewState("ready");
                } else {
                    setPreviewState("running");
                }
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 1000);
        return () => clearInterval(interval);
    }, [previewSession, api]);

    const chunks = useMemo(() => {
        const chunks: [number, number][] = [[16, 16]];
        for (let x = 14; x <= 17; x++) {
            for (let z = 14; z <= 17; z++) {
                if (x === 16 && z === 16) {
                    continue; // The first chunk is considered the center chunk
                }

                chunks.push([x, z]);
            }
        }
        return chunks;
    }, []);

    if (
        previewSession !== null &&
        JSON.stringify(props.data) !== JSON.stringify(previewData)
    ) {
        setPreviewSession(null);
        setPreviewData(null);
        setPreviewState("running");
        setError(null);
        return <></>;
    }

    if (props.hide) {
        return <></>;
    }

    if (previewSession === null) {
        return (
            <Center w="100%" h="100%">
                <VStack>
                    <Text as="h1" fontSize="2xl" fontWeight="bold">
                        Preview of the map
                    </Text>
                    <Text align="center">
                        This will generate a preview of the map. This can take a
                        while, so please be patient.
                    </Text>
                    <HStack color="yellow.500">
                        <BiError />{" "}
                        <Text align="center">
                            This feature is experimental and may not work as
                            expected.
                        </Text>
                    </HStack>
                    <Button
                        colorScheme="blue"
                        leftIcon={<BiShow />}
                        mt={6}
                        onClick={async () => {
                            const response = await api.post(
                                "/preview",
                                JSON.stringify(props.data)
                            );

                            if (!response || response.status !== 200) {
                                toast({
                                    title: "Network error",
                                    description:
                                        "Execution failed due to a network error",
                                    status: "error",
                                });
                                return;
                            }

                            await forTime(200); // Wait for the server to start the preview (it's not instant)
                            setPreviewSession(response.data.id);
                            setPreviewData(deepCopy(props.data));
                            setPreviewState("running");
                            setError(null);
                        }}
                    >
                        Generate preview
                    </Button>
                </VStack>
            </Center>
        );
    }

    if (previewState === "running") {
        return (
            <Center w="100%" h="100%">
                <VStack>
                    <Spinner />
                    <Text>Server is generating preview...</Text>
                </VStack>
            </Center>
        );
    }

    if (error !== null) {
        return (
            <Center w="100%" h="100%">
                <VStack color="gray.500">
                    <BiCube size={64} />
                    <Text
                        as="h1"
                        fontSize="2xl"
                        fontWeight="bold"
                        align="center"
                    >
                        {error.title}
                    </Text>
                    <Text align="center">{error.subtitle}</Text>
                </VStack>
            </Center>
        );
    }

    return (
        <Box w="100%" h="100%">
            <MinecraftViewer
                chunks={chunks}
                regionPath={api.getUrl(`/session/${previewSession}/region/0/0`)}
                assetsPath="/assets.zip"
                backgroundColor={[26 / 255, 32 / 255, 44 / 255]}
                onError={(e) => {
                    if (e.message === "Empty structure loaded") {
                        setError({
                            title: "The preview is empty",
                            subtitle:
                                "Empty map was generated, but some regions were touched (eg. by placing Air blocks).",
                        });
                    } else if (
                        e.message === "Invalid compression mode undefined"
                    ) {
                        setError({
                            title: "The preview is empty",
                            subtitle:
                                "Empty map was generated, and no regions were touched. The program did not attempt to place any blocks.",
                        });
                    } else {
                        toast({
                            title: "Failed to load the preview",
                            description: e.message,
                            status: "error",
                        });
                        setPreviewSession(null);
                    }
                }}
                spinner={
                    <Center w="100%" h="100%">
                        <VStack>
                            <Spinner />
                            <Text>Processing the region file...</Text>
                        </VStack>
                    </Center>
                }
            />
        </Box>
    );
}
