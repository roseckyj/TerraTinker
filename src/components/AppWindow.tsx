import { Box, Flex, VStack, useToken } from "@chakra-ui/react";
import { useState } from "react";
import { GeneratorData } from "../types/generatorTypes";
import { Step } from "./Step";

export interface IAppWindowProps {
    steps: Step[];
    data: GeneratorData;
    onDataChange: (newData: GeneratorData) => void;
}

export function AppWindow({ steps, data, onDataChange }: IAppWindowProps) {
    const [selectedStep, setSelectedStep] = useState<number>(0);

    const applied = steps.map((step, index) =>
        step(data, onDataChange, index === selectedStep, () =>
            setSelectedStep(index)
        )
    );

    return (
        <Flex
            direction="row"
            flexGrow={1}
            flexShrink={1}
            h={`calc(100vh - ${useToken("sizes", "20")})`}
        >
            <Box
                overflowY="auto"
                w={80}
                h="full"
                borderRightStyle="solid"
                borderRightWidth={2}
                borderRightColor="gray.800"
            >
                <VStack w="full" alignItems="stretch" spacing={0}>
                    {applied.map((step) => step.menuItem)}
                </VStack>
            </Box>

            <Box flexGrow={1} bg="gray.800">
                {applied.map((step) => step.window)}
            </Box>
        </Flex>
    );
}
