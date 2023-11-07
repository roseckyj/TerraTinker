import {
    Box,
    Center,
    Flex,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider";
import { useMemo, useState } from "react";
import { BiMinus, BiPlus, BiSearch, BiX } from "react-icons/bi";
import { useMap } from "react-leaflet";
import { Panel } from "reactflow";
import { Await } from "../utils/Await";

export function MapControls() {
    const provider = useMemo(() => new OpenStreetMapProvider(), []);
    const [searchResult, setSearchResult] = useState<Promise<
        SearchResult<RawResult>[]
    > | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const map = useMap();

    return (
        <Panel position="top-left" style={{ zIndex: 1000 }}>
            <Flex direction="row" alignItems="start" fontFamily={"body"}>
                <Flex direction="column" alignItems="center" zIndex={1000}>
                    <IconButton
                        aria-label="Zoom in"
                        icon={<BiPlus />}
                        onClick={() => {
                            map.zoomIn();
                        }}
                        colorScheme="gray"
                        bg="blackAlpha.800"
                        _hover={{ bg: "blackAlpha.900" }}
                        borderBottomRadius={0}
                    />
                    <IconButton
                        aria-label="Zoom out"
                        icon={<BiMinus />}
                        onClick={() => {
                            map.zoomOut();
                        }}
                        colorScheme="gray"
                        bg="blackAlpha.800"
                        _hover={{ bg: "blackAlpha.900" }}
                        borderTopRadius={0}
                        mb={2}
                    />
                    {/* <IconButton
                        aria-label="Fit view"
                        icon={<BiCrosshair />}
                        onClick={() => {
                            // flow.fitView();
                        }}
                        colorScheme="gray"
                        bg="blackAlpha.800"
                        _hover={{ bg: "blackAlpha.900" }}
                    /> */}
                </Flex>
                <Flex ml={4} direction="row" alignItems="center">
                    <VStack
                        borderRadius="md"
                        bg="blackAlpha.800"
                        alignItems="stretch"
                        w={96}
                        spacing={0}
                        overflow="hidden"
                    >
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <BiSearch />
                            </InputLeftElement>
                            <Input
                                variant="filled"
                                borderBottomRadius={0}
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSearchResult(
                                        provider.search({
                                            query: e.target.value,
                                        })
                                    );
                                }}
                            />
                            <InputRightElement>
                                <IconButton
                                    aria-label="Clear search"
                                    icon={<BiX />}
                                    variant="ghost"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSearchResult(null);
                                    }}
                                />
                            </InputRightElement>
                        </InputGroup>
                        {searchResult && (
                            <Await
                                for={searchResult}
                                loading={
                                    <Center my={4}>
                                        <Spinner />
                                    </Center>
                                }
                            >
                                {(result) =>
                                    result.map((value) => (
                                        <Box
                                            px={4}
                                            py={2}
                                            w="full"
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                            whiteSpace="nowrap"
                                            cursor="pointer"
                                            _hover={{
                                                bg: "blackAlpha.900",
                                            }}
                                            onClick={() => {
                                                map.flyTo(
                                                    [value.y, value.x] as any,
                                                    14,
                                                    {
                                                        duration: 1,
                                                    }
                                                );
                                                setSearchQuery("");
                                                setSearchResult(null);
                                            }}
                                        >
                                            {value.label}
                                        </Box>
                                    ))
                                }
                            </Await>
                        )}
                    </VStack>
                </Flex>
            </Flex>
        </Panel>
    );
}
