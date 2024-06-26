import { Box, Flex, FlexProps } from "@chakra-ui/react";
import { BiGitRepoForked, BiRocket } from "react-icons/bi";
import { WithHelp } from "../help/WithHelp";

export interface IGenericNodeProps extends FlexProps {
    title: string;
    category: string;
    helpPath?: string;
    children: React.ReactNode;
    locked: boolean;
    selected?: boolean;
    tags?: ("action" | "fork")[];
}

export function GenericNode({
    title,
    category,
    children,
    selected,
    tags,
    locked,
    helpPath,
    ...rest
}: IGenericNodeProps) {
    const tagSet = new Set(tags || []);
    // const nodeId = useNodeId();

    const content = (
        <Flex
            bg={"gray.700"}
            borderRadius="md"
            direction="column"
            alignItems="stretch"
            shadow={selected && !locked ? "outline" : "dark-lg"}
            pointerEvents={locked ? "none" : undefined}
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
                {/* <Box opacity={0.5} fontSize="xs" mt={2} textAlign="center">
            {nodeId?.split("-")[0]}
        </Box> */}
            </Flex>
        </Flex>
    );

    return helpPath ? <WithHelp path={helpPath}>{content}</WithHelp> : content;
}
