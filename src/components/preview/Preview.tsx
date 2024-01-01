import {
    Box,
    Button,
    Center,
    Spinner,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { BiRocket } from "react-icons/bi";
import { MinecraftViewer } from "react-minecraft-viewer";
import { GeneratorData } from "../../types/generatorTypes";

export interface IPreviewProps {
    data: GeneratorData;
    apiUrl: string;
    hide: boolean;
}

export function Preview(props: IPreviewProps) {
    const [previewSession, setPreviewSession] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<GeneratorData | null>(null);
    const [previewState, setPreviewState] = useState<"running" | "ready">(
        "running"
    );
    const toast = useToast();

    useEffect(() => {
        const checkStatus = async () => {
            if (previewSession) {
                try {
                    const response = await axios.get(
                        `${props.apiUrl}/session/${previewSession}`
                    );
                    if (response.data.state === "finished") {
                        setPreviewState("ready");
                    } else {
                        setPreviewState("running");
                    }
                } catch (e) {
                    setPreviewState("running");
                }
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 1000);
        return () => clearInterval(interval);
    }, [previewSession, props.apiUrl]);

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
                    <Text>
                        This will generate a preview of the map. This can take a
                        while, so please be patient.
                    </Text>
                    <Button
                        colorScheme="blue"
                        leftIcon={<BiRocket />}
                        mt={6}
                        onClick={async () => {
                            try {
                                const response = await axios.post(
                                    props.apiUrl + "/preview",
                                    JSON.stringify(props.data),
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

                                setPreviewSession(response.data.id);
                                setPreviewData(props.data);
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

    return (
        <Box w="100%" h="100%">
            <MinecraftViewer
                chunks={chunks}
                regionPath={`${props.apiUrl}/session/${previewSession}/region/0/0`}
                assetsPath="McVizFrontend/assets.zip"
                backgroundColor={[26 / 255, 32 / 255, 44 / 255]}
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
