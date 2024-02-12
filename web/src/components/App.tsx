import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Portal,
    Spacer,
    Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { BiBookOpen, BiQuestionMark, BiSolidCube } from "react-icons/bi";
import { AppWindow } from "./AppWindow";
import { useAppData } from "./DataProvider";
import { useHelp } from "./help/HelpProvider";
import { MapStep } from "./map/_MapStep";
import { NodeGraphStep } from "./nodeGraph/_NodeGraphStep";
import { PreviewStep } from "./preview/_PreviewStep";
import { PublishStep } from "./publish/_PublishStep";
import { IconButtonTooltip } from "./utils/IconButtonTooltip";
import { ServerStatus } from "./utils/ServerStatus";

export interface IAppProps {}

export function App() {
    // Data
    console.log(useAppData());
    const { data, setData } = useAppData();

    const help = useHelp();

    return (
        <>
            <Flex
                position="fixed"
                inset="0"
                direction="column"
                alignItems="stretch"
                bg="gray.900"
                color="white"
            >
                <HStack
                    h={20}
                    borderBottomStyle="solid"
                    borderBottomWidth={2}
                    borderBottomColor="gray.800"
                    px={6}
                    flexShrink={0}
                >
                    <Icon as={BiSolidCube} mr={4} fontSize="3xl" />
                    <Text fontSize="2xl" fontWeight="bold">
                        TerraTinker
                    </Text>
                    <Spacer />
                    <ServerStatus />
                    <Button
                        ml={4}
                        leftIcon={<BiQuestionMark />}
                        onClick={() => help.toggleHelpOverlay()}
                    >
                        Help
                    </Button>
                    <IconButtonTooltip
                        aria-label="Open documentation"
                        icon={<BiBookOpen />}
                        onClick={() => help.onReopen()}
                    />
                </HStack>
                <AppWindow
                    data={data}
                    onDataChange={setData}
                    steps={[MapStep, NodeGraphStep, PreviewStep, PublishStep]}
                />
            </Flex>
            <HelpOverlay />
        </>
    );
}

const HelpOverlay = observer(() => {
    const help = useHelp();

    if (help.helpOverlay) {
        return (
            <Portal>
                <Box
                    position="fixed"
                    inset={0}
                    bg="blackAlpha.400"
                    backdropFilter="auto"
                    backdropSaturate={0.2}
                    onClick={() => help.toggleHelpOverlay()}
                ></Box>
            </Portal>
        );
    }

    return <></>;
});
