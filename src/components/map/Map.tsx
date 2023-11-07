import { Box } from "@chakra-ui/react";
import { MapContainer, TileLayer } from "react-leaflet";
import { MapControls } from "./MapControls";

export function Map() {
    return (
        <Box w="full" h="full" position="relative">
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ width: "100%", height: "100%" }}
                zoomControl={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapControls />
            </MapContainer>
        </Box>
    );
}
