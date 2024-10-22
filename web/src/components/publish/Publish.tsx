import {
    Button,
    Center,
    Spinner,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiCube, BiDownload, BiRocket, BiStop } from "react-icons/bi";
import { useApi } from "../../api/ApiProvider";
import { GeneratorData } from "../../types/generatorTypes";
import { deepCopy } from "../../utils/deepCopy";
import { downloadFileFromUrl } from "../../utils/downloadFile";

export interface IPublishProps {
    data: GeneratorData;
    hide: boolean;
}

export function Publish(props: IPublishProps) {
    const [publishSession, setPublishSession] = useState<string | null>(null);
    const [publishData, setPublishData] = useState<GeneratorData | null>(null);
    const [publishState, setPublishState] = useState<"running" | "ready">(
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
            if (publishSession) {
                const response = await api.get(`/session/${publishSession}`);
                if (
                    response &&
                    response.status === 200 &&
                    response.data.state === "finished"
                ) {
                    setPublishState("ready");
                } else if (
                    response &&
                    response.status === 200 &&
                    response.data.state === "canceled"
                ) {
                    setPublishSession(null);
                    setPublishState("running");
                } else if (
                    response &&
                    response.status === 200 &&
                    response.data.state === "error"
                ) {
                    toast({
                        title: "Error",
                        description: "Generator encountered an error while processing the map. You can try again or contact support if the issue persists.",
                        status: "error",
                        duration: null,
                        isClosable: true,
                    })
                    setPublishSession(null);
                    setPublishState("running");
                } else if (
                    response &&
                    response.status === 200 &&
                    response.data.state === "timeout"
                ) {
                    toast({
                        title: "Timed out",
                        description: "Generator took too long to process the map. Map generation was canceled.",
                        status: "error",
                        duration: null,
                        isClosable: true,
                    })
                    setPublishSession(null);
                    setPublishState("running");
                } else {
                    setPublishState("running");
                }
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 1000);
        return () => clearInterval(interval);
    }, [api, publishSession, toast]);

    if (
        publishSession !== null &&
        JSON.stringify(props.data) !== JSON.stringify(publishData)
    ) {
        setPublishSession(null);
        setPublishData(null);
        setPublishState("running");
        setError(null);
        api.get(`/session/${publishSession}/cancel`);
        return <></>;
    }

    if (props.hide) {
        return <></>;
    }

    if (publishSession === null) {
        return (
            <Center w="100%" h="100%">
                <VStack>
                    <Text as="h1" fontSize="2xl" fontWeight="bold">
                        Download the map
                    </Text>
                    <Text align="center">
                        This will generate a map and create a download link for
                        you. This process can take a few minutes.
                    </Text>
                    <Button
                        colorScheme="blue"
                        leftIcon={<BiRocket />}
                        mt={6}
                        onClick={async () => {
                            const response = await api.post(
                                "/run",
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

                            setPublishSession(response.data.id);
                            setPublishData(deepCopy(props.data));
                            setPublishState("running");
                            setError(null);
                        }}
                    >
                        Generate the map
                    </Button>
                </VStack>
            </Center>
        );
    }

    if (publishState === "running") {
        return (
            <Center w="100%" h="100%">
                <VStack>
                    <Spinner />
                    <Text>Server is generating the map...</Text>
                    <Button mt={6} onClick={() => {
                        api.get(`/session/${publishSession}/cancel`);
                        setPublishSession(null);
                        setPublishState("ready");
                    }}
                    leftIcon={<BiStop />}
                    >
                        Cancel
                    </Button>
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
        <Center w="100%" h="100%">
            <VStack>
                <Text>Download the generated map</Text>
                <Button
                    colorScheme="blue"
                    leftIcon={<BiDownload />}
                    mt={6}
                    onClick={() => {
                        downloadFileFromUrl(
                            api.getUrl(`/session/${publishSession}/zip`),
                            "world.zip"
                        );
                    }}
                >
                    Download
                </Button>
            </VStack>
        </Center>
    );
}
