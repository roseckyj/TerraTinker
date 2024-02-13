import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Center,
    Code,
    Flex,
    Heading,
    IconButton,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { Await } from "../utils/Await";
import { useHelp } from "./HelpProvider";
import { HelpNode } from "./HelpTreeView";
import { RenderMarkdown } from "./RenderMarkdown";

export interface IHelpContentProps {
    docsSpecs: HelpNode;
}

export const HelpContent = observer(({ docsSpecs }: IHelpContentProps) => {
    const help = useHelp();

    const path = help.currentPath;
    const nodeFromPath = (root: HelpNode, givenPath: string[]) =>
        givenPath.reduce(
            (prev, index) => (prev ? prev.children![index] || null : null),
            root as HelpNode | null
        );
    const currentNode = (root: HelpNode) => nodeFromPath(root, path);

    return (
        <Flex direction="column" flexGrow={1} h="full" minW={96}>
            <Flex
                direction="row"
                mt={4}
                mb={2}
                mx={6}
                alignItems="center"
                justifyContent="left"
            >
                <IconButton
                    aria-label="Back"
                    icon={<BiChevronLeft />}
                    onClick={() => help.onBack()}
                />
                <VStack flexGrow={1} alignItems="start" ml={6} spacing={1}>
                    <Heading as="h2" fontSize="xl">
                        {currentNode(docsSpecs)?.title}
                    </Heading>
                    <Breadcrumb
                        fontSize="sm"
                        spacing={2}
                        separator={<BiChevronRight opacity={0.5} />}
                        opacity={0.5}
                    >
                        {path.map((str, i) => (
                            <BreadcrumbItem
                                key={i}
                                isCurrentPage={i === path.length - 1}
                            >
                                <BreadcrumbLink
                                    onClick={
                                        i !== path.length - 1 &&
                                        nodeFromPath(
                                            docsSpecs as HelpNode,
                                            path.slice(0, i + 1)
                                        )?.file
                                            ? () =>
                                                  help.onOpen(
                                                      "/" +
                                                          path
                                                              .slice(0, i + 1)
                                                              .join("/")
                                                  )
                                            : undefined
                                    }
                                >
                                    {path
                                        .slice(0, i + 1)
                                        .reduce(
                                            (prev, index) =>
                                                prev && prev.children
                                                    ? prev.children[index]
                                                    : null,
                                            docsSpecs as HelpNode | null
                                        )?.title || "Not found"}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        ))}
                    </Breadcrumb>
                </VStack>
            </Flex>
            <Box flexGrow={1} overflowY="auto" px={6} pb={4}>
                <Await
                    key={path.join("/")}
                    for={axios.get(`docs/${currentNode(docsSpecs)?.file!}`)}
                    loading={
                        <Center>
                            <Spinner />
                        </Center>
                    }
                    error={(error) => (
                        <>
                            Documentation page with path{" "}
                            <Code>{path.join("/")}</Code> not found!
                        </>
                    )}
                >
                    {(response) => (
                        <RenderMarkdown>{response.data}</RenderMarkdown>
                    )}
                </Await>
            </Box>
        </Flex>
    );
});
