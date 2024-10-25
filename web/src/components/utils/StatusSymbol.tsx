import { Box, Spinner, Text } from "@chakra-ui/react";

export interface IStatusSymbolProps {
    status: "connected" | "disconnected" | "busy" | "queued";
    textBefore?: string;
    textAfter?: string;
}

export function StatusSymbol(props: IStatusSymbolProps) {
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
        case "queued":
            color = "yellow.500";
            break;
    }

    return (
        <>
            {props.textBefore && <Text color={color}>{props.textBefore}</Text>}
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
                            props.status === "disconnected" ||
                            props.status === "queued"
                                ? color
                                : undefined
                        }
                    />
                )}
            </Box>
            {props.textAfter && <Text color={color}>{props.textAfter}</Text>}
        </>
    );
}
