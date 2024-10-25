import { Box, HStack, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BiCloudDownload, BiLink, BiMap } from "react-icons/bi";
import { WithHelp } from "../help/WithHelp";
import { IAbstractMenuItemProps, MenuItem } from "../menu/MenuItem";
import { IconButtonTooltip } from "../utils/IconButtonTooltip";
import { LogSlider } from "../utils/LogSlider";
import { estimateMinAltitude } from "./estimateMinAltitude";

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

    const MAP_SIZE_LIMIT = 1000;

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
                            onClick={() => estimateMinAltitude(data, onChange)}
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
                                if (data.mapSize.width > MAP_SIZE_LIMIT)
                                    data.mapSize.width = MAP_SIZE_LIMIT;
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
                                if (data.mapSize.height > MAP_SIZE_LIMIT)
                                    data.mapSize.height = MAP_SIZE_LIMIT;
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
