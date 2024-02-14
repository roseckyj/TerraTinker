import {
    Box,
    Center,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Heading,
    Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { Await } from "../utils/Await";
import { ErrorBoundary } from "../utils/ErrorBoundaty";
import { HelpContent } from "./HelpContent";
import { useHelp } from "./HelpProvider";
import { HelpNode, HelpTreeView } from "./HelpTreeView";

export const Help = observer(() => {
    const help = useHelp();

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
                                    w={{
                                        base: "64",
                                        md: "96",
                                    }}
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
                                            tree={
                                                (docsSpecs as HelpNode)
                                                    .children || {}
                                            }
                                            path={[]}
                                        />
                                    </Box>
                                </Flex>
                                <ErrorBoundary
                                    error={(error) => (
                                        <Center>
                                            Error loading content...
                                        </Center>
                                    )}
                                >
                                    <HelpContent docsSpecs={docsSpecs} />
                                </ErrorBoundary>
                            </Flex>
                        )}
                    </Await>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
});
