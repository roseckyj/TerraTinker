import { Box, Flex, FlexProps } from "@chakra-ui/react";
import { BiGitRepoForked, BiRocket } from "react-icons/bi";
import { useNodeId } from "reactflow";

export interface IGenericNodeProps extends FlexProps {
    title: string;
    category: string;
    children: React.ReactNode;
    selected?: boolean;
    tags?: ("action" | "fork")[];
}

export function GenericNode({
    title,
    category,
    children,
    selected,
    tags,
    ...rest
}: IGenericNodeProps) {
    const tagSet = new Set(tags || []);
    const nodeId = useNodeId();

    return (
        <Flex
            bg={"gray.700"}
            borderRadius="md"
            direction="column"
            alignItems="stretch"
            shadow={selected ? "outline" : "dark-lg"}
            {...rest}
        >
            <Flex
                direction="row"
                px={3}
                py={1}
                fontWeight="bold"
                bg="gray.800"
                borderTopRadius="md"
                alignItems="center"
            >
                <Box flexGrow={1}>{title}</Box>
                {tagSet.has("action") && <BiRocket />}
                {tagSet.has("fork") && <BiGitRepoForked />}
            </Flex>
            <Flex my={2} direction="column" alignItems="stretch" mx={2}>
                {children}
                <Box opacity={0.5} fontSize="xs" mt={2} textAlign="center">
                    {nodeId?.split("-")[0]}
                </Box>
            </Flex>
        </Flex>
    );
}
