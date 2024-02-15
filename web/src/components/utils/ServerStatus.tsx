import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuList,
    Portal,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useApi } from "../../api/ApiProvider";
import { mcVersion } from "../../minecraft/mcData";

export function ServerStatus() {
    const [serverStatus, setServerStatus] = useState<{
        connected: boolean;
        queued: number;
        version: null | string;
    }>({
        connected: false,
        queued: 0,
        version: null,
    });

    const api = useApi();

    useEffect(() => {
        const checkConnection = async () => {
            const response = await api.get("/status");

            if (!response || response.status !== 200) {
                setServerStatus({
                    connected: false,
                    queued: 0,
                    version: null,
                });
                return;
            }

            const status = response.data.status;
            const queued = response.data.queued;
            const version = response.data.version;
            setServerStatus({
                connected: status === "ok",
                queued,
                version,
            });
        };

        checkConnection();
        const interval = setInterval(checkConnection, 1000);
        return () => clearInterval(interval);
    }, [api]);

    return (
        <Menu>
            <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={
                    serverStatus.connected ? (
                        serverStatus.queued > 0 ? (
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
                        ? serverStatus.queued > 0
                            ? `Busy (${serverStatus.queued} tasks running)`
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
                        <Text opacity={0.8}>Server game version:</Text>
                        <Text fontWeight="bold">
                            {serverStatus.version || "Disconnected"}
                        </Text>
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
