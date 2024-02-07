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
import { useCallback, useReducer, useState } from "react";
import { BiBookOpen, BiQuestionMark, BiSolidCube } from "react-icons/bi";
import { getDefaultGeneratorData } from "../data/getDefaultGeneratorData";
import { GeneratorData } from "../types/generatorTypes";
import { AppWindow } from "./AppWindow";
import { useHelp } from "./help/HelpProvider";
import { MapStep } from "./map/_MapStep";
import { NodeGraphStep } from "./nodeGraph/_NodeGraphStep";
import { PreviewStep } from "./preview/_PreviewStep";
import { PublishStep } from "./publish/_PublishStep";
import { IconButtonTooltip } from "./utils/IconButtonTooltip";
import { ServerStatus } from "./utils/ServerStatus";

const localStorageKey = "generatorData";
const HISTORY = 50;

export interface IAppProps {}

export function App() {
    // Data
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const [data, setData] = useState(() => {
        const stored = localStorage.getItem(localStorageKey);
        let data: GeneratorData;
        const def = getDefaultGeneratorData();
        if (!stored) {
            data = def;
            localStorage.setItem(localStorageKey, JSON.stringify(data));
        } else {
            data = { ...def, ...JSON.parse(stored) };
        }
        return data;
    });
    // const undo = useMemo(() => [] as string[], []);
    // const redo = useMemo(() => [] as string[], []);
    const setDataAndSave = useCallback((newData: GeneratorData) => {
        // undo.push(JSON.stringify(data));
        setData(newData);
        forceUpdate();
        localStorage.setItem(localStorageKey, JSON.stringify(newData));

        // redo.splice(0);
        // // Keep only last 50 history steps
        // while (undo.length > HISTORY) {
        //     undo.shift();
        // }
    }, []);
    // const doUndo = useCallback(() => {
    //     console.log(undo, redo);
    //     if (undo.length === 0) return;

    //     redo.push(JSON.stringify(data));
    //     // Keep only last 50 history steps
    //     while (redo.length > HISTORY) {
    //         redo.shift();
    //     }

    //     const history = JSON.parse(undo.pop()!);

    //     setData(history);
    //     forceUpdate();
    //     const stringified = JSON.stringify(data);
    //     localStorage.setItem(localStorageKey, stringified);
    // }, [data, redo, undo]);
    // const doRedo = useCallback(() => {
    //     console.log(undo, redo);
    //     if (redo.length === 0) return;

    //     undo.push(JSON.stringify(data));
    //     // Keep only last 50 history steps
    //     while (undo.length > HISTORY) {
    //         undo.shift();
    //     }

    //     const history = JSON.parse(redo.pop()!);

    //     setData(history);
    //     forceUpdate();
    //     const stringified = JSON.stringify(data);
    //     localStorage.setItem(localStorageKey, stringified);
    // }, [data, redo, undo]);

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
                    {/* <Box w={8} />
                    <IconButtonTooltip
                        aria-label="Undo"
                        icon={<BiUndo />}
                        onClick={doUndo}
                        isDisabled={undo.length === 0}
                    />
                    <IconButtonTooltip
                        aria-label="Redo"
                        icon={<BiRedo />}
                        onClick={doRedo}
                        isDisabled={redo.length === 0}
                    />
                    <Box w={8} /> */}
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
                    onDataChange={setDataAndSave}
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
