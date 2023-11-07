import {
    Box,
    HStack,
    Input,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Text,
} from "@chakra-ui/react";
import { BiMap } from "react-icons/bi";
import { IAbstractMenuItemProps, MenuItem } from "../menu/MenuItem";

export function MapMenuItem({ onClick, selected }: IAbstractMenuItemProps) {
    return (
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
                <Input variant="filled" type="number" />
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
                        value={1000}
                    />
                    <Input
                        flex={1}
                        variant="filled"
                        type="number"
                        value={1000}
                    />
                </HStack>
            </Box>
            <Box>
                <Text opacity={0.5} fontSize="smaller">
                    Horizontal scale
                </Text>
                <Slider defaultValue={30}>
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
            </Box>
            <Box>
                <Text opacity={0.5} fontSize="smaller">
                    Vertical scale
                </Text>
                <Slider defaultValue={50}>
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
            </Box>
        </MenuItem>
    );
}
