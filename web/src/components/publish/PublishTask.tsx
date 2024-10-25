import { Button, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { BiDownload, BiTrash, BiX } from "react-icons/bi";
import { useApi } from "../../api/ApiProvider";
import { downloadFileFromUrl } from "../../utils/downloadFile";
import { StatusSymbol } from "../utils/StatusSymbol";
import { PublishMapEntry } from "./Publish";

export interface IPublishTaskProps {
    index?: number;
    session: PublishMapEntry;
    onDelete?: () => void;
}

export function PublishTask({ index, session, onDelete }: IPublishTaskProps) {
    if (index === undefined) {
        index = 0;
    }

    const api = useApi();

    const [state, setState] = useState<
        "queued" | "running" | "finished" | "error" | "canceled" | null
    >(null);

    useEffect(() => {
        let interval: number = -1;

        const checkStatus = async () => {
            const response = await api.get(`/session/${session.id}`);

            let newState;
            if (response && response.status === 200) {
                newState = response.data.state;
            } else {
                newState = null;
            }

            setState(newState);

            if (
                !(newState === "queued" || newState === "running") &&
                interval !== -1
            ) {
                clearInterval(interval);
            }
        };

        interval = setInterval(checkStatus, 1000);
        checkStatus();
        return () => clearInterval(interval);
    }, [session, api]);

    return (
        <HStack bg={index % 2 === 0 ? "gray.700" : "gray.800"} px={10} py={6}>
            <VStack flexGrow={1} alignItems="start">
                <Text fontWeight="bold" fontSize="lg">
                    {session.name}
                </Text>
                <Text>{moment(session.date).fromNow()}</Text>
            </VStack>
            <HStack spacing={4}>
                {state !== null && (
                    <>
                        <Text fontWeight="bold">
                            {
                                {
                                    queued: "Queued",
                                    running: "Running",
                                    finished: "Finished",
                                    error: "Error",
                                    canceled: "Canceled",
                                }[state] as any
                            }
                        </Text>
                        <StatusSymbol
                            status={
                                {
                                    queued: "queued",
                                    running: "busy",
                                    finished: "connected",
                                    error: "disconnected",
                                    canceled: "disconnected",
                                }[state] as any
                            }
                        />
                    </>
                )}
            </HStack>
            <HStack spacing={4} ml={4}>
                <Button
                    onClick={() => {
                        api.get(`/session/${session.id}/cancel`);
                        setState("canceled");
                    }}
                    leftIcon={<BiX />}
                    isDisabled={!["queued", "running"].includes(state || "")}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        downloadFileFromUrl(
                            api.getUrl(`/session/${session.id}/zip`),
                            `${session.name}.zip`
                        );
                    }}
                    leftIcon={<BiDownload />}
                    colorScheme="blue"
                    isDisabled={state !== "finished"}
                >
                    Download map
                </Button>
                <IconButton
                    aria-label="Delete"
                    icon={<BiTrash />}
                    onClick={onDelete}
                    colorScheme="red"
                />
            </HStack>
        </HStack>
    );
}
