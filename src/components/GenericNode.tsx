import { Box, Flex, FlexProps } from "@chakra-ui/react";

export interface IGenericNodeProps extends FlexProps {
    title: string;
    category: string;
    children: React.ReactNode;
    selected?: boolean;
}

export function GenericNode({
    title,
    category,
    children,
    selected,
    ...rest
}: IGenericNodeProps) {
    return (
        <Flex
            bg="#303030"
            borderRadius="md"
            direction="column"
            alignItems="stretch"
            shadow={selected ? "outline" : "dark-lg"}
            {...rest}
        >
            <Box
                px={3}
                py={1}
                fontWeight="bold"
                bg="#292929"
                borderTopRadius="md"
            >
                {title}
            </Box>
            <Flex my={2} direction="column" alignItems="stretch" mx={2}>
                {children}
            </Flex>
        </Flex>
    );
}
