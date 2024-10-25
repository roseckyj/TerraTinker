import {
    Box,
    Button,
    HStack,
    Menu,
    MenuButton,
    MenuList,
    Portal,
    Text,
    VStack
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useApi } from "../../api/ApiProvider";
import { mcVersion } from "../../minecraft/mcData";
import { StatusSymbol } from "./StatusSymbol";

export function ServerStatus() {
    const [serverStatus, setServerStatus] = useState<{
        connected: boolean;
        queue: number;
        version: null | string;
        servers: {
            id: string;
            version: string;
            online: boolean;
            status: "busy" | "ready";
        }[];
    }>({
        connected: false,
        queue: 0,
        version: null,
        servers: [],
    });

    const api = useApi();

    useEffect(() => {
        const checkConnection = async () => {
            const response = await api.get("/status");

            if (!response || response.status !== 200) {
                setServerStatus({
                    connected: false,
                    queue: 0,
                    version: null,
                    servers: [],
                });
                return;
            }

            setServerStatus({
                connected: response.data.status === "ok",
                queue: response.data.queue,
                version: response.data.version,
                servers: response.data.servers,
            });
        };

        checkConnection();
        const interval = setInterval(checkConnection, 1000);
        return () => clearInterval(interval);
    }, [api]);

    const isBusy = serverStatus.servers?.every((server) => server.status === "busy" || !server.online) || serverStatus.queue > 0;

    return (
        <Menu>
            <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={
                    serverStatus.connected ? (
                        isBusy ? (
                            <StatusSymbol status="busy" />
                        ) : (
                            <StatusSymbol status="connected" />
                        )
                    ) : (
                        <StatusSymbol status="disconnected" />
                    )
                }
            >
                <Text
                    display={{
                        base: "none",
                        md: "block",
                    }}
                >
                    {serverStatus.connected
                        ? isBusy
                            ? `Busy${serverStatus.queue > 0 ? `(${serverStatus.queue} tasks in queue)` : ""}`
                            : `Connected`
                        : `Disconnected`}
                </Text>
            </MenuButton>
            <Portal>
                <MenuList color="gray.100" px={4}>
                    <Box mb={4}>
                        <Text opacity={0.8}>Client game version:</Text>
                        <Text fontWeight="bold">{mcVersion}</Text>
                    </Box>
                    <Box>
                        <Text opacity={0.8}>Connected servers:</Text>
                        <VStack align="stretch" spacing={2}>
                            {serverStatus.servers.map((server, i) => (
                                <HStack key={i} align="center">
                                    <StatusSymbol status={server.status === "busy" ? "busy" : server.online ? "connected" : "disconnected"} />
                                    <Text fontWeight="bold">Server {i + 1}</Text>
                                    <Text>({server.version})</Text>
                                </HStack>
                            ))}
                        </VStack>
                    </Box>
                </MenuList>
            </Portal>
        </Menu>
    );
}