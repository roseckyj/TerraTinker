import {
    Button,
    Center,
    Spinner,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiDownload, BiRocket } from "react-icons/bi";
import { GeneratorData } from "../../types/generatorTypes";
import { downloadFileFromUrl } from "../../utils/downloadFile";

export interface IPublishProps {
    data: GeneratorData;
    apiUrl: string;
    hide: boolean;
}

export function Publish(props: IPublishProps) {
    const [publishSession, setPublishSession] = useState<string | null>(null);
    const [publishData, setPublishData] = useState<GeneratorData | null>(null);
    const [publishState, setPublishState] = useState<"running" | "ready">(
        "running"
    );
    const toast = useToast();

    useEffect(() => {
        const checkStatus = async () => {
            if (publishSession) {
                try {
                    const response = await axios.get(
                        `http://localhost:7070/api/session/${publishSession}`
                    );
                    if (response.data.state === "finished") {
                        setPublishState("ready");
                    } else {
                        setPublishState("running");
                    }
                } catch (e) {
                    setPublishState("running");
                }
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 1000);
        return () => clearInterval(interval);
    }, [publishSession]);

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
                            try {
                                const response = await axios.post(
                                    "http://localhost:7070/api/run",
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

                                setPublishSession(response.data.id);
                                setPublishData(props.data);
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
                            `http://localhost:7070/api/session/${publishSession}/zip`,
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
