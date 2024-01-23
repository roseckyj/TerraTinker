import { Button, Flex, HStack, Icon, Spacer, Text } from "@chakra-ui/react";
import { useReducer, useState } from "react";
import { BiQuestionMark, BiSolidCube } from "react-icons/bi";
import { getDefaultGeneratorData } from "../data/getDefaultGeneratorData";
import { GeneratorData } from "../types/generatorTypes";
import { AppWindow } from "./AppWindow";
import { useHelp } from "./help/HelpProvider";
import { MapStep } from "./map/_MapStep";
import { NodeGraphStep } from "./nodeGraph/_NodeGraphStep";
import { PreviewStep } from "./preview/_PreviewStep";
import { PublishStep } from "./publish/_PublishStep";
import { ServerStatus } from "./utils/ServerStatus";

const localStorageKey = "generatorData";

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
    const setDataAndSave = (data: GeneratorData) => {
        setData(data);
        forceUpdate();
        localStorage.setItem(localStorageKey, JSON.stringify(data));
    };

    const help = useHelp();

    return (
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
                    onClick={() => help.onReopen()}
                >
                    Help
                </Button>
            </HStack>
            <AppWindow
                data={data}
                onDataChange={setDataAndSave}
                steps={[MapStep, NodeGraphStep, PreviewStep, PublishStep]}
            />
        </Flex>
    );
}
