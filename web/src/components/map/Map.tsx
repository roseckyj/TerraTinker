import { Box, useToast, useToken } from "@chakra-ui/react";
import { DivIcon, Marker as LeafletMarker } from "leaflet";
import { useMemo, useState } from "react";
import { renderToString } from "react-dom/server";
import { BiSolidMap } from "react-icons/bi";
import {
    MapContainer,
    Marker,
    Polygon,
    TileLayer,
    useMapEvents,
} from "react-leaflet";
import { CoordsTranslator } from "../../minecraft/CoordsTranslator";
import { GeneratorData } from "../../types/generatorTypes";
import { Position } from "../../types/genericTypes";
import { insertMiddlePoints } from "../../utils/insertMidPoints";
import { estimateMinAltitude } from "./estimateMinAltitude";
import { MapControls } from "./MapControls";

export interface IMapProps {
    data: GeneratorData;
    onChange: (data: GeneratorData) => void;
    isSelecting: boolean;
    onSelectionToggle: () => void;
}

export function Map(props: IMapProps) {
    const { data, isSelecting } = props;
    const toast = useToast();
    const [hasError, setHasError] = useState(false);

    const translator = useMemo(
        () =>
            new CoordsTranslator(
                data.mapCenter,
                [0, 0],
                0,
                data.scale.horizontal,
                data.scale.vertical,
                0
            ),
        [data.mapCenter, data.scale.horizontal, data.scale.vertical]
    );

    const iconColor = useToken("colors", "blue.500");
    const icon = useMemo(
        () =>
            new DivIcon({
                html: renderToString(
                    <BiSolidMap size="50px" style={{ color: iconColor }} />
                ),
                iconSize: [50, 50],
                iconAnchor: [25, 50],
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const rectanglePoints = useMemo(() => {
        let points: Position[] = [
            [-data.mapSize.width / 2, -data.mapSize.height / 2],
            [data.mapSize.width / 2, -data.mapSize.height / 2],
            [data.mapSize.width / 2, data.mapSize.height / 2],
            [-data.mapSize.width / 2, data.mapSize.height / 2],
        ];
        for (let i = 0; i < 4; i++) {
            points = insertMiddlePoints(points);
        }

        const translated = points.map((point) =>
            translator.XZToLatLon(point[0], point[1])
        );
        if (
            translated.some(
                (point) => Number.isNaN(point[0]) || Number.isNaN(point[1])
            )
        ) {
            if (!hasError) {
                toast({
                    title: "Invalid map size",
                    description: "Map size is too large",
                    status: "error",
                });
                setHasError(true);
            }
            return [];
        }
        setHasError(false);
        return translated;
    }, [data.mapSize.width, data.mapSize.height, translator, hasError, toast]);

    const previewPoints = useMemo(() => {
        let points: Position[] = [
            [-32, -32],
            [31, -32],
            [31, 31],
            [-32, 31],
        ];
        for (let i = 0; i < 4; i++) {
            points = insertMiddlePoints(points);
        }

        const translated = points.map((point) =>
            translator.XZToLatLon(point[0], point[1])
        );
        if (
            translated.some(
                (point) => Number.isNaN(point[0]) || Number.isNaN(point[1])
            )
        ) {
            return [];
        }
        return translated;
    }, [translator]);

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
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                />
                <MapControls {...props} />
                <Marker
                    position={data.mapCenter}
                    icon={icon}
                    draggable={true}
                    eventHandlers={{
                        dragend: (e) => {
                            const markerPos = (
                                e.target as LeafletMarker
                            ).getLatLng();
                            markerPos.lng = markerPos.lng % 360;
                            if (markerPos.lng > 180) markerPos.lng -= 360;
                            data.mapCenter = [markerPos.lat, markerPos.lng];
                            estimateMinAltitude(data, props.onChange);
                            props.onChange(data);
                        },
                    }}
                />
                <Polygon positions={rectanglePoints} />
                <Polygon
                    positions={previewPoints}
                    dashArray={[6, 10]}
                    fill={false}
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
            e.latlng.lng = e.latlng.lng % 360;
            if (e.latlng.lng > 180) e.latlng.lng -= 360;
            data.mapCenter = [e.latlng.lat, e.latlng.lng];
            estimateMinAltitude(data, onChange);
            onChange(data);
            onSelectionToggle();
            map.flyTo(e.latlng, map.getZoom(), {
                duration: 0.25,
            });
        },
    });

    return <></>;
}
