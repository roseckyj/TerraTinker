import { Box, Flex } from "@chakra-ui/react";

export interface IGenericNodeProps {
    title: string;
    category: string;
    children: React.ReactNode;
}

export function GenericNode({ title, category, children }: IGenericNodeProps) {
    return (
        <Flex
            bg="#303030"
            borderRadius="md"
            direction="column"
            alignItems="stretch"
            shadow="dark-lg"
        >
            <Box
                px={3}
                py={1}
                fontWeight="bold"
                bg="red.500"
                borderTopRadius="md"
            >
                {title}
            </Box>
            <Flex my={2} direction="column" alignItems="stretch">
                {children}
            </Flex>
        </Flex>
    );
}
