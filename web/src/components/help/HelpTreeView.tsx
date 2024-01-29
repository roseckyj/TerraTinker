import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Box,
    Icon,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { BiMinus, BiPlus, BiRadioCircle } from "react-icons/bi";
import { useHelp } from "./HelpProvider";

export type HelpTree = { [key: string]: HelpNode };

export type HelpNode = {
    title: string;
    file?: string;
    children?: HelpTree;
};

export interface IHelpTreeProps {
    tree: HelpTree;
    path: string[];
}

export const HelpTreeView = observer(({ tree, path }: IHelpTreeProps) => {
    const help = useHelp();

    return (
        <Accordion allowToggle allowMultiple>
            {Object.entries(tree).map(([i, node]) => (
                <AccordionItem border="none" key={i}>
                    {({ isExpanded }) => (
                        <>
                            <AccordionButton
                                onClick={() => {
                                    if (node.file) {
                                        help.onOpen(
                                            "/" + [...path, i].join("/")
                                        );
                                    }
                                }}
                            >
                                {node.children ? (
                                    isExpanded ? (
                                        <Icon as={BiMinus} />
                                    ) : (
                                        <Icon as={BiPlus} />
                                    )
                                ) : (
                                    <Icon as={BiRadioCircle} />
                                )}
                                <Box as="span" flex="1" textAlign="left" pl={3}>
                                    {node.title}
                                </Box>
                            </AccordionButton>
                            {node.children && (
                                <AccordionPanel
                                    p={0}
                                    ml={6}
                                    borderLeftColor="gray.700"
                                    borderLeftWidth={1}
                                >
                                    <HelpTreeView
                                        tree={node.children}
                                        path={[...path, i]}
                                    />
                                </AccordionPanel>
                            )}
                        </>
                    )}
                </AccordionItem>
            ))}
        </Accordion>
    );
});
