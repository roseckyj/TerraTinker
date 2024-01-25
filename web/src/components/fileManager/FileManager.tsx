import {
    Box,
    Button,
    Center,
    Flex,
    HStack,
    Heading,
    Icon,
    IconButton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
} from "@chakra-ui/react";
import { BiDownload, BiFile, BiTrash, BiUpload } from "react-icons/bi";
import { incremental } from "../../utils/incremental";

export interface IFileManagerProps {}

export function FileManager(props: IFileManagerProps) {
    return (
        <Flex direction="column" w="full" h="full" px={6} py={6} wrap="nowrap">
            <Heading size="lg" mb={8}>
                Your project files
            </Heading>
            <HStack mb={6}>
                <Button colorScheme="blue" leftIcon={<BiUpload />}>
                    Upload file
                </Button>
                {/* <Button leftIcon={<BiStoreAlt />}>Presets</Button> */}
            </HStack>
            <Flex direction="row" flex={1} minH={0}>
                <TableContainer w="full" flexGrow={1} overflowY="auto">
                    <Table variant="striped">
                        <Thead
                            position="sticky"
                            top={0}
                            bg="gray.800"
                            zIndex="sticky"
                        >
                            <Tr>
                                <Th w={0}></Th>
                                <Th>filename</Th>
                                <Th>file type</Th>
                                <Th>uploaded</Th>
                                <Th w={0}></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {incremental(50).map((i) => (
                                <Tr>
                                    <Td pr={0}>
                                        <BiFile />
                                    </Td>
                                    <Td>Lorem ipsum dolor</Td>
                                    <Td>GeoTIF</Td>
                                    <Td>2024-01-24</Td>
                                    <Td py={0}>
                                        <HStack>
                                            <IconButton
                                                icon={<BiDownload />}
                                                aria-label="Download"
                                            />
                                            <IconButton
                                                icon={<BiTrash />}
                                                aria-label="Delete"
                                            />
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Box w={96}>
                    <Center w={96} h={32}>
                        <VStack>
                            <Icon as={BiFile} fontSize="6xl" />
                            <Text>Click on a file to view it</Text>
                        </VStack>
                    </Center>
                </Box>
            </Flex>
        </Flex>
    );
}
