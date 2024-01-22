import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Heading,
    IconButton,
    VStack,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { Asciidoc } from "./Asciidoc";
import { useHelp } from "./HelpProvider";

export const Help = observer(() => {
    const help = useHelp();

    return (
        <Drawer
            onClose={() => help.onClose()}
            isOpen={help.isOpen}
            size="xl"
            placement="right"
        >
            <DrawerOverlay />
            <DrawerContent color="whiteAlpha.900">
                <DrawerCloseButton />
                <DrawerBody>
                    <Flex
                        direction="row"
                        mt={4}
                        mb={8}
                        alignItems="center"
                        justifyContent="left"
                    >
                        <IconButton
                            aria-label="Back"
                            icon={<BiChevronLeft />}
                            onClick={() => help.onBack()}
                        />
                        <VStack flexGrow={1} alignItems="start" ml={6}>
                            <Heading as="h2" fontSize="xl">
                                Hello world
                            </Heading>
                            <Breadcrumb
                                fontSize="sm"
                                spacing="8px"
                                separator={<BiChevronRight opacity={0.5} />}
                                opacity={0.5}
                            >
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#">
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#">
                                        About
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem isCurrentPage>
                                    <BreadcrumbLink href="#">
                                        Contact
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            </Breadcrumb>
                        </VStack>
                    </Flex>
                    <Asciidoc>Hello world</Asciidoc>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
});
