import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Center,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
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
import { HelpNode, HelpTreeView } from "./HelpTreeView";
import { RenderMarkdown } from "./RenderMarkdown";

export const Help = observer(() => {
    const help = useHelp();

    const path = help.currentPath;

    return (
        <Drawer
            onClose={() => help.onClose()}
            isOpen={help.isOpen}
            size="help"
            placement="right"
        >
            <DrawerOverlay />
            <DrawerContent color="whiteAlpha.900">
                <DrawerCloseButton />
                <DrawerBody p={0}>
                    <Await
                        for={axios.get("/docs/docs.json")}
                        loading={
                            <Center>
                                <Spinner />
                            </Center>
                        }
                    >
                        {({ data: docsSpecs }) => (
                            <Flex direction="row" h="full">
                                <Flex
                                    direction="column"
                                    bg="gray.800"
                                    pt={6}
                                    shadow="md"
                                    w={96}
                                    flexShrink={0}
                                >
                                    <Heading
                                        as="h2"
                                        fontSize="xl"
                                        mb={6}
                                        px={6}
                                    >
                                        Browse chapters
                                    </Heading>
                                    <Box
                                        flexGrow={1}
                                        overflowY="auto"
                                        ml={-2}
                                        px={6}
                                        pb={6}
                                    >
                                        <HelpTreeView
                                            tree={docsSpecs as HelpNode[]}
                                            path={[]}
                                        />
                                    </Box>
                                </Flex>
                                <Flex direction="column" flexGrow={1} h="full">
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
                                        <VStack
                                            flexGrow={1}
                                            alignItems="start"
                                            ml={6}
                                            spacing={1}
                                        >
                                            <Heading as="h2" fontSize="xl">
                                                {
                                                    path
                                                        .map((str) =>
                                                            parseInt(str)
                                                        )
                                                        .reduce(
                                                            (prev, index) =>
                                                                prev.children![
                                                                    index
                                                                ],
                                                            {
                                                                title: "Root",
                                                                children:
                                                                    docsSpecs,
                                                            } as HelpNode
                                                        ).title
                                                }
                                            </Heading>
                                            <Breadcrumb
                                                fontSize="sm"
                                                spacing={2}
                                                separator={
                                                    <BiChevronRight
                                                        opacity={0.5}
                                                    />
                                                }
                                                opacity={0.5}
                                            >
                                                {path.map((str, i) => (
                                                    <BreadcrumbItem
                                                        isCurrentPage={
                                                            i ===
                                                            path.length - 1
                                                        }
                                                    >
                                                        <BreadcrumbLink
                                                            onClick={
                                                                i !==
                                                                    path.length -
                                                                        1 &&
                                                                path
                                                                    .slice(
                                                                        0,
                                                                        i + 1
                                                                    )
                                                                    .map(
                                                                        (str) =>
                                                                            parseInt(
                                                                                str
                                                                            )
                                                                    )
                                                                    .reduce(
                                                                        (
                                                                            prev,
                                                                            index
                                                                        ) =>
                                                                            prev.children![
                                                                                index
                                                                            ],
                                                                        {
                                                                            title: "Root",
                                                                            children:
                                                                                docsSpecs,
                                                                        } as HelpNode
                                                                    ).file
                                                                    ? () =>
                                                                          help.onOpen(
                                                                              "/" +
                                                                                  path
                                                                                      .slice(
                                                                                          0,
                                                                                          i +
                                                                                              1
                                                                                      )
                                                                                      .join(
                                                                                          "/"
                                                                                      )
                                                                          )
                                                                    : undefined
                                                            }
                                                        >
                                                            {
                                                                path
                                                                    .slice(
                                                                        0,
                                                                        i + 1
                                                                    )
                                                                    .map(
                                                                        (str) =>
                                                                            parseInt(
                                                                                str
                                                                            )
                                                                    )
                                                                    .reduce(
                                                                        (
                                                                            prev,
                                                                            index
                                                                        ) =>
                                                                            prev.children![
                                                                                index
                                                                            ],
                                                                        {
                                                                            title: "Root",
                                                                            children:
                                                                                docsSpecs,
                                                                        } as HelpNode
                                                                    ).title
                                                            }
                                                        </BreadcrumbLink>
                                                    </BreadcrumbItem>
                                                ))}
                                            </Breadcrumb>
                                        </VStack>
                                    </Flex>
                                    <Box
                                        flexGrow={1}
                                        overflowY="auto"
                                        px={6}
                                        pb={4}
                                    >
                                        <Await
                                            key={path.join("/")}
                                            for={axios.get(
                                                `docs/${path
                                                    .map((str) => parseInt(str))
                                                    .reduce(
                                                        (prev, index) =>
                                                            prev.children![
                                                                index
                                                            ],
                                                        {
                                                            title: "Root",
                                                            children: docsSpecs,
                                                        } as HelpNode
                                                    ).file!}`
                                            )}
                                            loading={
                                                <Center>
                                                    <Spinner />
                                                </Center>
                                            }
                                            error={(error) => (
                                                <>{JSON.stringify(error)}</>
                                            )}
                                        >
                                            {(response) => (
                                                <RenderMarkdown>
                                                    {response.data}
                                                </RenderMarkdown>
                                            )}
                                        </Await>
                                    </Box>
                                </Flex>
                            </Flex>
                        )}
                    </Await>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
});
