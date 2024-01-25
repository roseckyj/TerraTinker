import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Box,
    Icon,
} from "@chakra-ui/react";
import { BiMinus, BiPlus, BiRadioCircle } from "react-icons/bi";
import { useOpenHelp } from "./HelpProvider";

export type HelpNode = {
    title: string;
    file?: string;
    children?: HelpNode[];
};

export interface IHelpTreeProps {
    tree: HelpNode[];
}

export function HelpTreeView({ tree }: IHelpTreeProps) {
    const help = useOpenHelp();

    return (
        <Accordion allowToggle>
            {tree.map((node, i) => (
                <AccordionItem border="none" key={i}>
                    {({ isExpanded }) => (
                        <>
                            <AccordionButton
                                onClick={() => {
                                    if (
                                        (!isExpanded || !node.children) &&
                                        node.file
                                    ) {
                                        help(node.file);
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
                                <AccordionPanel pb={4} pr={0}>
                                    <HelpTreeView tree={node.children} />
                                </AccordionPanel>
                            )}
                        </>
                    )}
                </AccordionItem>
            ))}
        </Accordion>
    );
}
