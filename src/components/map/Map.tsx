import { Box } from "@chakra-ui/react";
import { Icon, Marker as LeafletMarker } from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import {
    MapContainer,
    Marker,
    Rectangle,
    TileLayer,
    useMapEvents,
} from "react-leaflet";
import { CoordsTranslator } from "../../minecraft/CoordsTranslator";
import { GeneratorData } from "../../types/generatorTypes";
import { MapControls } from "./MapControls";

export interface IMapProps {
    data: GeneratorData;
    onChange: (data: GeneratorData) => void;
    isSelecting: boolean;
    onSelectionToggle: () => void;
}

export function Map(props: IMapProps) {
    const { data, isSelecting } = props;

    const translator = new CoordsTranslator(
        data.mapCenter,
        [0, 0],
        0,
        data.scale.horizontal,
        data.scale.vertical,
        0
    );

    return (
        <Box
            w="full"
            h="full"
            position="relative"
            className={isSelecting ? "leaflet-selecting" : ""}
        >
            <MapContainer
                center={data.mapCenter}
                zoom={13}
                style={{ width: "100%", height: "100%" }}
                zoomControl={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapControls {...props} />
                <Marker
                    position={data.mapCenter}
                    icon={
                        new Icon({
                            iconUrl: icon,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                        })
                    }
                    draggable={true}
                    eventHandlers={{
                        dragend: (e) => {
                            const markerPos = (
                                e.target as LeafletMarker
                            ).getLatLng();
                            data.mapCenter = [markerPos.lat, markerPos.lng];
                            props.onChange(data);
                        },
                    }}
                />
                <Rectangle
                    bounds={[
                        translator.XZToLatLon(
                            -data.mapSize.width / 2,
                            -data.mapSize.height / 2
                        ),
                        translator.XZToLatLon(
                            data.mapSize.width / 2,
                            data.mapSize.height / 2
                        ),
                    ]}
                />
                <MapEventsHandler {...props} />
            </MapContainer>
        </Box>
    );
}

function MapEventsHandler(props: IMapProps) {
    const { data, isSelecting, onChange, onSelectionToggle } = props;

    const map = useMapEvents({
        click(e) {
            if (!isSelecting) return;
            data.mapCenter = [e.latlng.lat, e.latlng.lng];
            onChange(data);
            onSelectionToggle();
            map.flyTo(e.latlng, map.getZoom(), {
                duration: 0.25,
            });
        },
    });

    return <></>;
}
