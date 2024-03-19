import { Box, HStack, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { BiCloudDownload, BiLink, BiMap } from "react-icons/bi";
import { CoordsTranslator } from "../../minecraft/CoordsTranslator";
import { Position } from "../../types/genericTypes";
import { insertMiddlePoints } from "../../utils/insertMidPoints";
import { WithHelp } from "../help/WithHelp";
import { IAbstractMenuItemProps, MenuItem } from "../menu/MenuItem";
import { IconButtonTooltip } from "../utils/IconButtonTooltip";
import { LogSlider } from "../utils/LogSlider";

export interface IMapMenuProps extends IAbstractMenuItemProps {
    onSelectionToggle: () => void;
    isSelecting: boolean;
}

export function MapMenuItem({
    onClick,
    selected,
    data,
    onChange,
    isSelecting,
    onSelectionToggle,
}: IMapMenuProps) {
    const [isSizeLocked, setIsSizeLocked] = useState(true);

    return (
        <WithHelp path={`/map`}>
            <MenuItem
                icon={<BiMap />}
                label="Select area"
                onClick={onClick}
                selected={selected}
            >
                <Box>
                    <Text opacity={0.5} fontSize="smaller">
                        Map center
                    </Text>
                    <HStack>
                        <Input
                            flex={1}
                            variant="filled"
                            type="text"
                            value={`${data.mapCenter[0].toFixed(
                                5
                            )} ${data.mapCenter[1].toFixed(5)}`}
                            isDisabled
                        />
                        <IconButtonTooltip
                            aria-label="Select map center"
                            icon={<BiMap />}
                            colorScheme={isSelecting ? "blue" : "gray"}
                            onClick={() => onSelectionToggle()}
                        />
                    </HStack>
                </Box>
                <Box>
                    <Text opacity={0.5} fontSize="smaller">
                        Minimum altitude
                    </Text>
                    <HStack>
                        <Input
                            flex={1}
                            variant="filled"
                            type="number"
                            value={`${data.minAltitude}`}
                            onChange={(e) => {
                                data.minAltitude = parseInt(e.target.value);
                                onChange(data);
                            }}
                        />
                        <IconButtonTooltip
                            aria-label="Estimate minimum altitude"
                            icon={<BiCloudDownload />}
                            onClick={async () => {
                                let points: Position[] = [
                                    [
                                        -data.mapSize.width / 2,
                                        -data.mapSize.height / 2,
                                    ],
                                    [
                                        data.mapSize.width / 2,
                                        -data.mapSize.height / 2,
                                    ],
                                    [
                                        data.mapSize.width / 2,
                                        data.mapSize.height / 2,
                                    ],
                                    [
                                        -data.mapSize.width / 2,
                                        data.mapSize.height / 2,
                                    ],
                                ];

                                points = insertMiddlePoints(points);
                                points.push([0, 0]);

                                const translator = new CoordsTranslator(
                                    data.mapCenter,
                                    [0, 0],
                                    0,
                                    data.scale.horizontal,
                                    data.scale.vertical,
                                    0
                                );

                                const latLons = points.map((point) =>
                                    translator.XZToLatLon(point[0], point[1])
                                );
                                const response = await axios.get(
                                    `https://api.open-meteo.com/v1/elevation?latitude=${latLons
                                        .map((p) => p[0])
                                        .join(",")}&longitude=${latLons
                                        .map((p) => p[1])
                                        .join(",")}`
                                );
                                const alts = response.data.elevation;
                                const minAlt = Math.min(...alts);
                                data.minAltitude = minAlt - 20;
                                onChange(data);
                            }}
                        />
                    </HStack>
                </Box>
                <Box>
                    <Text opacity={0.5} fontSize="smaller">
                        Minecraft map size
                    </Text>
                    <HStack>
                        <Input
                            flex={1}
                            variant="filled"
                            type="number"
                            value={data.mapSize.width}
                            onChange={(e) => {
                                const aspect =
                                    data.mapSize.height / data.mapSize.width;
                                data.mapSize.width = parseInt(e.target.value);
                                if (
                                    Number.isNaN(data.mapSize.width) ||
                                    data.mapSize.width < 1
                                )
                                    data.mapSize.width = 1;
                                if (data.mapSize.width > 1000000)
                                    data.mapSize.width = 1000000;
                                if (isSizeLocked) {
                                    data.mapSize.height =
                                        data.mapSize.width * aspect;
                                }
                                onChange(data);
                            }}
                        />
                        <IconButtonTooltip
                            aria-label="Lock aspect ratio"
                            icon={<BiLink />}
                            onClick={() => setIsSizeLocked(!isSizeLocked)}
                            colorScheme={isSizeLocked ? "blue" : "gray"}
                        />
                        <Input
                            flex={1}
                            variant="filled"
                            type="number"
                            value={data.mapSize.height}
                            onChange={(e) => {
                                const aspect =
                                    data.mapSize.width / data.mapSize.height;
                                data.mapSize.height = parseInt(e.target.value);
                                if (
                                    Number.isNaN(data.mapSize.height) ||
                                    data.mapSize.height < 1
                                )
                                    data.mapSize.height = 1;
                                if (data.mapSize.height > 1000000)
                                    data.mapSize.height = 1000000;
                                if (isSizeLocked) {
                                    data.mapSize.width =
                                        data.mapSize.height * aspect;
                                }
                                onChange(data);
                            }}
                        />
                    </HStack>
                </Box>
                <Box>
                    <Text opacity={0.5} fontSize="smaller">
                        Horizontal scale
                    </Text>
                    <LogSlider
                        min={0.04}
                        max={25}
                        center={1}
                        stops={[
                            0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1, 1.2, 1.5, 2,
                            3, 5, 10, 15, 20, 25,
                        ]}
                        value={data.scale.horizontal}
                        onChange={(value) => {
                            data.scale.horizontal = value;
                            onChange(data);
                        }}
                    />
                </Box>
                <Box>
                    <Text opacity={0.5} fontSize="smaller">
                        Vertical scale
                    </Text>
                    <LogSlider
                        min={0.04}
                        max={25}
                        center={1}
                        stops={[
                            0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1, 1.2, 1.5, 2,
                            3, 5, 10, 15, 20, 25,
                        ]}
                        value={data.scale.vertical}
                        onChange={(value) => {
                            data.scale.vertical = value;
                            onChange(data);
                        }}
                    />
                </Box>
            </MenuItem>
        </WithHelp>
    );
}
