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
    path: number[];
}

export function HelpTreeView({ tree, path }: IHelpTreeProps) {
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
