import { Box, Flex, IconButton } from "@chakra-ui/react";
import { BiCrosshair, BiMinus, BiPlus } from "react-icons/bi";
import { MapContainer, TileLayer } from "react-leaflet";
import { Panel } from "reactflow";

export function Map() {
    return (
        <Box w="full" h="full" position="relative">
            <Panel position="top-left" style={{ zIndex: 1000 }}>
                <Flex direction="column" alignItems="center" zIndex={1000}>
                    <IconButton
                        aria-label="Zoom in"
                        icon={<BiPlus />}
                        onClick={() => {
                            // flow.zoomIn();
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
                            // flow.zoomOut();
                            // console.log(flow.getZoom());
                        }}
                        colorScheme="gray"
                        bg="blackAlpha.800"
                        _hover={{ bg: "blackAlpha.900" }}
                        borderTopRadius={0}
                        mb={2}
                    />
                    <IconButton
                        aria-label="Fit view"
                        icon={<BiCrosshair />}
                        onClick={() => {
                            // flow.fitView();
                        }}
                        colorScheme="gray"
                        bg="blackAlpha.800"
                        _hover={{ bg: "blackAlpha.900" }}
                    />
                </Flex>
            </Panel>
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ width: "100%", height: "100%" }}
                zoomControl={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>
        </Box>
    );
}
