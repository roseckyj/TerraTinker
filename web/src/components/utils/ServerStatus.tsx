import {
    Box,
    Button,
    HStack,
    Menu,
    MenuButton,
    MenuList,
    Portal,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useApi } from "../../api/ApiProvider";
import { mcVersion } from "../../minecraft/mcData";

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

    const isBusy = serverStatus.servers?.every((server) => server.status === "busy") || serverStatus.queue > 0;

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
                            ? `Busy (${serverStatus.queue} tasks in queue)`
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
