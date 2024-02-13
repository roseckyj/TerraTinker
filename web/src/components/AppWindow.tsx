import {
    Box,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    VStack,
    useDisclosure,
    useToken,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiMenu } from "react-icons/bi";
import { GeneratorData } from "../types/generatorTypes";
import { Step } from "./Step";
import { IconButtonTooltip } from "./utils/IconButtonTooltip";

export interface IAppWindowProps {
    steps: Step[];
    data: GeneratorData;
    onDataChange: (newData: GeneratorData) => void;
}

export function AppWindow({ steps, data, onDataChange }: IAppWindowProps) {
    const [selectedStep, setSelectedStep] = useState<number>(0);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const applied = steps.map((step, index) =>
        step(data, onDataChange, index === selectedStep, () =>
            setSelectedStep(index)
        )
    );

    return (
        <Box
            flexGrow={1}
            flexShrink={1}
            h={`calc(100vh - ${useToken("sizes", "20")})`}
            position="relative"
        >
            <Box
                display={{
                    base: "none",
                    md: "block",
                }}
                overflowY="auto"
                position="absolute"
                top={0}
                left={0}
                bottom={0}
                w={80}
                borderRightStyle="solid"
                borderRightWidth={2}
                borderRightColor="gray.800"
            >
                <VStack w="full" alignItems="stretch" spacing={0}>
                    {applied.map((step, key) => step.menuItem(key))}
                </VStack>
            </Box>

            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent color="gray.100" bg="gray.800">
                    <DrawerCloseButton />
                    <VStack w="full" alignItems="stretch" spacing={0}>
                        {applied.map((step, key) => step.menuItem(key))}
                    </VStack>
                </DrawerContent>
            </Drawer>

            <Box
                bg="gray.800"
                position="absolute"
                top={0}
                right={0}
                bottom={0}
                left={{
                    base: 0,
                    md: 80,
                }}
            >
                {applied.map((step, key) => step.window(key))}
                <IconButtonTooltip
                    zIndex="overlay"
                    aria-label="Open menu"
                    icon={<BiMenu />}
                    position="absolute"
                    left={4}
                    bottom={4}
                    onClick={onOpen}
                    bg="gray.700"
                    display={{
                        base: "inline-flex",
                        md: "none",
                    }}
                    _hover={{
                        bg: "gray.600",
                    }}
                    _active={{
                        bg: "gray.600",
                    }}
                />
            </Box>
        </Box>
    );
}
