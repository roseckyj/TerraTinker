import { Box, HStack, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useApi } from "../../api/ApiProvider";

export function ServerStatus() {
    const [serverStatus, setServerStatus] = useState<{
        connected: boolean;
        queued: number;
    }>({
        connected: false,
        queued: 0,
    });

    const api = useApi();

    useEffect(() => {
        const checkConnection = async () => {
            const response = await api.get("/status");

            if (!response || response.status !== 200) {
                setServerStatus({
                    connected: false,
                    queued: 0,
                });
                return;
            }

            const status = response.data.status;
            const queued = response.data.queued;
            setServerStatus({
                connected: status === "ok",
                queued,
            });
        };

        checkConnection();
        const interval = setInterval(checkConnection, 1000);
        return () => clearInterval(interval);
    }, [api]);

    return (
        <HStack>
            {serverStatus.connected ? (
                serverStatus.queued > 0 ? (
                    <>
                        <Text
                            opacity={0.8}
                            display={{
                                base: "none",
                                md: "block",
                            }}
                        >
                            Busy ({serverStatus.queued} tasks running)
                        </Text>
                        <StatusSymbol status="busy" />
                    </>
                ) : (
                    <>
                        <Text
                            opacity={0.8}
                            display={{
                                base: "none",
                                md: "block",
                            }}
                        >
                            Connected
                        </Text>
                        <StatusSymbol status="connected" />
                    </>
                )
            ) : (
                <>
                    <Text
                        opacity={0.8}
                        display={{
                            base: "none",
                            md: "block",
                        }}
                    >
                        Disconnected
                    </Text>
                    <StatusSymbol status="disconnected" />
                </>
            )}
        </HStack>
    );
}

interface IStatusSymbolProps {
    status: "connected" | "disconnected" | "busy";
}

function StatusSymbol(props: IStatusSymbolProps) {
    let color = "gray.500";
    switch (props.status) {
        case "connected":
            color = "green.500";
            break;
        case "disconnected":
            color = "red.500";
            break;
        case "busy":
            color = "yellow.500";
            break;
    }

    return (
        <Box
            rounded="full"
            w="0.5em"
            h="0.5em"
            position="relative"
            m={1}
            bg={props.status === "disconnected" ? undefined : color}
        >
            {props.status !== "connected" && (
                <Spinner
                    position="absolute"
                    inset={-1}
                    size="sm"
                    color={color}
                    emptyColor={
                        props.status === "disconnected" ? color : undefined
                    }
                />
            )}
        </Box>
    );
}
