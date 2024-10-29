import {
    Button,
    HStack,
    Icon,
    Image,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import {
    BiFile,
    BiInfoCircle,
    BiLogoDiscord,
    BiLogoGithub,
} from "react-icons/bi";
import pkg from "../../package.json";
import { IconButtonTooltip } from "./utils/IconButtonTooltip";

export function AppInfo() {
    const { isOpen, onClose, onToggle } = useDisclosure();

    return (
        <>
            <HStack w="full" flexShrink={0} p={6}>
                <Button
                    leftIcon={<BiInfoCircle />}
                    flexGrow={1}
                    onClick={onToggle}
                >
                    About
                </Button>
                <IconButtonTooltip
                    as={Link}
                    icon={<BiLogoGithub />}
                    aria-label="Github repository"
                    isExternal
                    href="https://github.com/roseckyj/TerraTinker"
                />
                <IconButtonTooltip
                    as={Link}
                    icon={<BiLogoDiscord />}
                    aria-label="Author's Discord"
                    isExternal
                    href="https://discord.com/users/xrosecky"
                />
                <IconButtonTooltip
                    as={Link}
                    icon={<BiFile />}
                    aria-label="Related Thesis"
                    isExternal
                    href="https://is.muni.cz/th/ru3xf/?lang=en"
                />
            </HStack>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack align="start" mt={4} mb={6} mx={2} spacing={6}>
                            <HStack>
                                <Icon
                                    as={Image}
                                    src="/logo.png"
                                    mr={4}
                                    fontSize="3xl"
                                />
                                <Text
                                    fontSize="3xl"
                                    fontWeight="bold"
                                    display={{
                                        base: "none",
                                        md: "block",
                                    }}
                                >
                                    TerraTinker
                                </Text>
                                <Text
                                    fontSize="sm"
                                    fontWeight="bold"
                                    display={{
                                        base: "none",
                                        md: "block",
                                    }}
                                    opacity={0.2}
                                    pt={4}
                                    pl={2}
                                >
                                    v{pkg.version}
                                </Text>
                            </HStack>
                            <Text>
                                TerraTinker is a node-based tool for
                                transforming geospatial data into Minecraft
                                maps.
                            </Text>
                            <Text>
                                This tool was created as a part of a master's
                                thesis at Masaryk University in Brno, Czech
                                Republic.
                            </Text>
                            <Text>
                                The source code of the application is
                                Open-Source and available on{" "}
                                <Link
                                    color={"blue.500"}
                                    href="https://github.com/roseckyj/TerraTinker"
                                    isExternal
                                >
                                    GitHub
                                </Link>
                                .
                            </Text>
                            <Text>
                                In case of any questions or issues, feel free to
                                contact the author on{" "}
                                <Link
                                    color={"blue.500"}
                                    href="https://discord.com/users/xrosecky"
                                    isExternal
                                >
                                    Discord
                                </Link>
                                .
                            </Text>
                            <VStack w="full" align="stretch">
                                <Button
                                    as={Link}
                                    leftIcon={<BiLogoGithub />}
                                    isExternal
                                    justifyContent="start"
                                    href="https://github.com/roseckyj/TerraTinker"
                                >
                                    Github repository
                                </Button>
                                <Button
                                    as={Link}
                                    leftIcon={<BiLogoDiscord />}
                                    isExternal
                                    justifyContent="start"
                                    href="https://discord.com/users/xrosecky"
                                >
                                    Discord xrosecky
                                </Button>
                                <Button
                                    as={Link}
                                    leftIcon={<BiFile />}
                                    isExternal
                                    justifyContent="start"
                                    href="https://is.muni.cz/th/ru3xf/?lang=en"
                                >
                                    Related Thesis
                                </Button>
                            </VStack>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
