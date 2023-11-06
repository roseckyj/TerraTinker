import { Flex, Text } from "@chakra-ui/react";
import { NodeProps } from "reactflow";
import { FlowHandle } from "./FlowHandles";

export function FlowStart({ selected }: NodeProps<null>) {
    return (
        <Flex
            bg="gray.800"
            borderRadius="md"
            direction="column"
            alignItems="stretch"
            shadow={selected ? "outline" : "dark-lg"}
            px={3}
            py={2}
            w={44}
        >
            <Text fontWeight="bold">Execution Flow</Text>
            <FlowHandle type="source" />
        </Flex>
    );
}
