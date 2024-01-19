import {
    Button,
    Center,
    Spinner,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiDownload, BiRocket } from "react-icons/bi";
import { useApi } from "../../api/ApiProvider";
import { GeneratorData } from "../../types/generatorTypes";
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
    const toast = useToast();
    const api = useApi();

    useEffect(() => {
        const checkStatus = async () => {
            if (publishSession) {
                const response = await api.get(`/session/${publishSession}`);
                if (
                    response.status === 200 &&
                    response.data.state === "finished"
                ) {
                    setPublishState("ready");
                } else {
                    setPublishState("running");
                }
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 1000);
        return () => clearInterval(interval);
    }, [api, publishSession]);

    if (
        publishSession !== null &&
        JSON.stringify(props.data) !== JSON.stringify(publishData)
    ) {
        setPublishSession(null);
        setPublishData(null);
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
                    <Text>
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

                            if (response.status !== 200) {
                                toast({
                                    title: "Network error",
                                    description:
                                        "Execution failed due to a network error",
                                    status: "error",
                                });
                                return;
                            }

                            setPublishSession(response.data.id);
                            setPublishData(props.data);
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
