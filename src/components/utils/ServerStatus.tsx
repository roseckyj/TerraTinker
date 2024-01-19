import { Box, HStack, Text } from "@chakra-ui/react";
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

            if (response.status !== 200) {
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
                        <Box
                            rounded="full"
                            w="0.5em"
                            h="0.5em"
                            bg="yellow.500"
                        />
                        <Text opacity={0.8}>
                            Busy ({serverStatus.queued} tasks queued)
                        </Text>
                    </>
                ) : (
                    <>
                        <Box
                            rounded="full"
                            w="0.5em"
                            h="0.5em"
                            bg="green.500"
                        />
                        <Text opacity={0.8}>Connected</Text>
                    </>
                )
            ) : (
                <>
                    <Box rounded="full" w="0.5em" h="0.5em" bg="red.500" />
                    <Text opacity={0.8}>Disconnected</Text>
                </>
            )}
        </HStack>
    );
}
