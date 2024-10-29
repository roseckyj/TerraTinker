import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Image,
    Portal,
    Spacer,
    Text,
    VStack,
    useToast,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import moment from "moment";
import {
    BiBookOpen,
    BiFolderOpen,
    BiQuestionMark,
    BiSave,
} from "react-icons/bi";
import { downloadFile } from "../utils/downloadFile";
import { openFile } from "../utils/openFile";
import { AppWindow } from "./AppWindow";
import { useAppData } from "./DataProvider";
import { useHelp } from "./help/HelpProvider";
import { MapStep } from "./map/_MapStep";
import { NodeGraphStep } from "./nodeGraph/_NodeGraphStep";
import { PreviewStep } from "./preview/_PreviewStep";
import { PublishStep } from "./publish/_PublishStep";
import { ConfirmButton } from "./utils/ConfirmButton";
import { ErrorBoundary } from "./utils/ErrorBoundaty";
import { IconButtonTooltip } from "./utils/IconButtonTooltip";
import { ServerStatus } from "./utils/ServerStatus";

export interface IAppProps {}

export function App() {
    // Data
    const { data, setData } = useAppData();

    const help = useHelp();
    const toast = useToast();

    return (
        <ErrorBoundary
            error={(error) => (
                <VStack alignItems="center" justifyItems="center">
                    <Text fontSize="3xl" textAlign="center">
                        Something went wrong!
                    </Text>
                    <Text textAlign="center">
                        We are sorry, but the application crashed. The error
                        log:
                    </Text>
                    <Text textAlign="center">{error.message}</Text>
                </VStack>
            )}
        >
            <Flex
                position="fixed"
                inset="0"
                direction="column"
                alignItems="stretch"
                bg="gray.900"
                color="white"
                userSelect="none"
            >
                <HStack
                    h={20}
                    borderBottomStyle="solid"
                    borderBottomWidth={2}
                    borderBottomColor="gray.800"
                    px={6}
                    flexShrink={0}
                >
                    <Icon as={Image} src="/logo.png" mr={4} fontSize="3xl" />
                    <Text
                        fontSize="3xl"
                        fontWeight="bold"
                        display={{
                            base: "none",
                            md: "block",
                        }}
                    >
                        TerraTinker
                    </Text>
                    <Spacer />
                    <ServerStatus />
                    <IconButtonTooltip
                        ml={4}
                        aria-label="Export configuration"
                        icon={<BiSave />}
                        onClick={() => {
                            downloadFile(
                                new File(
                                    [JSON.stringify(data)],
                                    `terratinker_${moment().toISOString()}.json`,
                                    { type: "text/plain" }
                                )
                            );
                        }}
                    />
                    <ConfirmButton
                        type="IconButton"
                        label="Import configuration"
                        modalTitle="Do you want to import a configuration?"
                        modalSubtitle="This will overwrite the current configuration."
                        icon={<BiFolderOpen />}
                        onConfirm={async () => {
                            try {
                                const text = (await openFile(
                                    ".json"
                                )) as string;
                                const parsed = JSON.parse(text);

                                setData(parsed);

                                toast({
                                    title: "Configuration imported",
                                    description:
                                        "Configuration wars imported from the selected file",
                                    status: "success",
                                });
                            } catch (e) {
                                toast({
                                    title: "Failed to import",
                                    description: (e as any).message,
                                    status: "error",
                                });
                            }
                        }}
                    />
                    <Button
                        ml={4}
                        leftIcon={<BiQuestionMark />}
                        onClick={() => help.toggleHelpOverlay()}
                        display={{
                            base: "none",
                            md: "inline-flex",
                        }}
                    >
                        Help
                    </Button>
                    <IconButtonTooltip
                        ml={4}
                        aria-label="Open help"
                        icon={<BiQuestionMark />}
                        onClick={() => help.toggleHelpOverlay()}
                        display={{
                            base: "inline-flex",
                            md: "none",
                        }}
                    />
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
        </ErrorBoundary>
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
