import { Box, Center, Flex } from "@chakra-ui/react";
import { Handle, HandleProps, Position } from "reactflow";
import { VarType } from "../types/serializationTypes";
import { varTypes } from "./_varTypes";

export interface ITypedHandleProps extends Omit<HandleProps, "type"> {
    id: string;
    varType: VarType;
    connected?: boolean;
    nullable?: boolean;
    value: any;
    onChange: (value: any) => void;
}

export function TypedHandle({
    varType,
    position,
    connected,
    nullable,
    value,
    onChange,
    ...rest
}: ITypedHandleProps) {
    const typedef = varTypes[varType];

    const handleStyle: React.CSSProperties = {
        border: "3px solid #1D1D1D",
        width: "20px",
        height: "20px",
        borderRadius: "100%",
        backgroundColor: typedef.color,
        ...(position === Position.Left
            ? {
                  left: "-18px",
              }
            : {
                  right: "-18px",
              }),
    };

    return (
        <>
            <Handle
                type={position === Position.Left ? "target" : "source"}
                position={position}
                style={handleStyle}
                {...rest}
            >
                {nullable && (
                    <Center position="absolute" inset={0} pointerEvents="none">
                        <Box bg="#1D1D1D" w={2} h={2} rounded="full"></Box>
                    </Center>
                )}
                {!connected && position === Position.Left && (
                    <>
                        <Flex
                            bg="#303030"
                            borderRadius="md"
                            direction="row"
                            alignItems="stretch"
                            shadow="dark-lg"
                            position="absolute"
                            right={8}
                            top={-1}
                            bottom={-1}
                            cursor="default"
                        >
                            <Box
                                bg="#1d1d1d"
                                h="fill"
                                w={2}
                                mr={2}
                                borderLeftRadius="md"
                            ></Box>
                            <Flex
                                direction="row"
                                alignItems="stretch"
                                fontSize="0.9em"
                            >
                                {typedef.editor(value, onChange)}
                            </Flex>
                            <Box
                                style={handleStyle}
                                my="auto"
                                ml={2}
                                mr="-10px"
                            ></Box>
                        </Flex>
                    </>
                )}
            </Handle>
            {!connected && position === Position.Left && (
                <Box
                    position="absolute"
                    top="calc(50% - 1px)"
                    height="2px"
                    left="-6"
                    right="0"
                    zIndex={-1}
                    bg={handleStyle.backgroundColor}
                ></Box>
            )}
        </>
    );
}
