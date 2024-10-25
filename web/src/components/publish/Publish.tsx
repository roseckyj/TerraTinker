import {
    Box,
    Button,
    HStack,
    Input,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { BiRocket } from "react-icons/bi";
import { useApi } from "../../api/ApiProvider";
import { GeneratorData } from "../../types/generatorTypes";
import { PublishTask } from "./PublishTask";

export interface IPublishProps {
    data: GeneratorData;
    hide: boolean;
}

const localStorageKey = "publishSessions";

export type PublishMapEntry = {
    id: string;
    name: string;
    date: string;
};

export function Publish(props: IPublishProps) {
    const [sessions, setSessions] = useState<PublishMapEntry[]>([]);
    const [mapName, setMapName] = useState<string>("");
    const api = useApi();
    const toast = useToast();

    useEffect(() => {
        const stored = localStorage.getItem(localStorageKey);
        if (stored) {
            setSessions(JSON.parse(stored));
        }
    }, []);

    if (props.hide) {
        return <></>;
    }

    return (
        <VStack w="100%" h="100%" alignItems="stretch">
            <VStack alignItems="stretch" py={8} px={10}>
                <Text as="h1" fontSize="2xl" fontWeight="bold">
                    Publish
                </Text>
                <Text>
                    This will generate a map and create a download link for you.
                    This process can take a long time, so please be patient.
                </Text>
                <Text>
                    The generator runs in the background even if you close your
                    browser, so you can come back later to download the map.
                </Text>
                <HStack align="stretch" mt={6}>
                    <Input
                        type="text"
                        placeholder="Map name"
                        flexShrink={1}
                        flexGrow={0}
                        w={96}
                        value={mapName}
                        onChange={(e) => setMapName(e.target.value)}
                    />
                    <Button
                        flexShrink={0}
                        flexGrow={0}
                        colorScheme="blue"
                        leftIcon={<BiRocket />}
                        isDisabled={mapName.length === 0}
                        onClick={async () => {
                            if (mapName.length === 0) {
                                return;
                            }

                            const response = await api.post("/run", props.data);

                            if (!response || response.status !== 200) {
                                toast({
                                    title: "Network error",
                                    description:
                                        "Execution failed due to a network error",
                                    status: "error",
                                });
                                return;
                            }

                            const sessionId = response.data.id as string;
                            const newSessions = [
                                ...sessions,
                                {
                                    id: sessionId,
                                    name: mapName,
                                    date: moment().toISOString(),
                                },
                            ];
                            setSessions(newSessions);
                            localStorage.setItem(
                                localStorageKey,
                                JSON.stringify(newSessions)
                            );

                            toast({
                                title: "Map generation started",
                                description:
                                    "The server is now generating the map",
                                status: "info",
                            });
                        }}
                    >
                        Generate the map
                    </Button>
                </HStack>
            </VStack>
            <Box flexGrow={1} overflowY="auto">
                <VStack w="full" alignItems="stretch" spacing={0}>
                    {[...sessions].reverse().map((session, i) => (
                        <PublishTask
                            key={i}
                            index={i}
                            session={session}
                            onDelete={() => {
                                const newSessions = sessions.filter(
                                    (s) => s.id !== session.id
                                );
                                setSessions(newSessions);
                                localStorage.setItem(
                                    localStorageKey,
                                    JSON.stringify(newSessions)
                                );
                            }}
                        />
                    ))}
                </VStack>
            </Box>
        </VStack>
    );
}
