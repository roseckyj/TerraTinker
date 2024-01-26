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

export function HelpTreeView({ tree, path }: IHelpTreeProps) {
    const help = useOpenHelp();

    console.log(tree);

    return (
        <Accordion allowToggle>
            {Object.entries(tree).map(([i, node]) => (
                <AccordionItem border="none" key={i}>
                    {({ isExpanded }) => (
                        <>
                            <AccordionButton
                                onClick={() => {
                                    if (
                                        (!isExpanded || !node.children) &&
                                        node.file
                                    ) {
                                        help("/" + [...path, i].join("/"));
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
}
