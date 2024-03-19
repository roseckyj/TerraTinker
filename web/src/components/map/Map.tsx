import { Box, useToken } from "@chakra-ui/react";
import { DivIcon, Marker as LeafletMarker } from "leaflet";
import { useMemo } from "react";
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
import { MapControls } from "./MapControls";

export interface IMapProps {
    data: GeneratorData;
    onChange: (data: GeneratorData) => void;
    isSelecting: boolean;
    onSelectionToggle: () => void;
}

export function Map(props: IMapProps) {
    const { data, isSelecting } = props;

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
        let points: Position[] = [];
        for (let i = 0; i < Math.PI * 2; i += (Math.PI * 2) / 1000) {
            points.push([
                (Math.sin(i) * data.mapSize.width) / 2,
                (-Math.cos(i) * data.mapSize.height) / 2,
            ]);
        }

        return points.map((point) => translator.XZToLatLon(point[0], point[1]));
    }, [translator, data.mapSize.width, data.mapSize.height]);

    const realPoints = useMemo(() => {
        function getDestinationPoint(
            start: Position,
            distance: number,
            bearing: number
        ): Position {
            const radius = 6371e3; // Earth's radius in meters
            const δ = distance / radius; // angular distance in radians
            const θ = (bearing * Math.PI) / 180; // bearing converted to radians

            const φ1 = (start[0] * Math.PI) / 180; // current lat point converted to radians
            const λ1 = (start[1] * Math.PI) / 180; // current lon point converted to radians

            const φ2 = Math.asin(
                Math.sin(φ1) * Math.cos(δ) +
                    Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
            );
            const λ2 =
                λ1 +
                Math.atan2(
                    Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
                    Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
                );

            return [(φ2 * 180) / Math.PI, (λ2 * 180) / Math.PI];
        }

        function drawCircle(
            start: Position,
            distance: number,
            steps: number = 100
        ): Position[] {
            const points: Position[] = [];
            for (let i = 0; i < steps; i++) {
                const bearing = (360 / steps) * i;
                const point = getDestinationPoint(start, distance, bearing);
                points.push(point);
            }
            return points;
        }

        const points = drawCircle(
            data.mapCenter,
            data.mapSize.height / 2,
            1000
        );
        return points;
    }, [data.mapCenter, data.mapSize.height]);

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

        return points.map((point) => translator.XZToLatLon(point[0], point[1]));
    }, [translator]);

    function getDistance(coord1: Position, coord2: Position): number {
        const radius = 6371e3; // Earth's radius in meters
        const [lat1, lon1] = coord1.map((degree) => (degree * Math.PI) / 180); // Convert degrees to radians
        const [lat2, lon2] = coord2.map((degree) => (degree * Math.PI) / 180); // Convert degrees to radians

        const deltaLat = lat2 - lat1;
        const deltaLon = lon2 - lon1;

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) *
                Math.cos(lat2) *
                Math.sin(deltaLon / 2) *
                Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return radius * c; // Distance in meters
    }

    console.log(getDistance(realPoints[0], rectanglePoints[0]));

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
                minZoom={1}
                maxZoom={30}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxNativeZoom={18}
                    maxZoom={30}
                />
                <MapControls {...props} />
                <Polygon positions={rectanglePoints} />
                <Polygon
                    positions={previewPoints}
                    dashArray={[6, 10]}
                    fill={false}
                />
                <Polygon positions={realPoints} fillColor="red" color="red" />
                <Marker
                    position={data.mapCenter}
                    icon={icon}
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
