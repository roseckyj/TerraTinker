import { HStack, IconButton, Spacer, Text } from "@chakra-ui/react";
import {
    BiDownArrowAlt,
    BiLayer,
    BiPlus,
    BiTrash,
    BiUpArrowAlt,
} from "react-icons/bi";
import { getDefaultLayer } from "../../data/getDefaultGeneratorData";
import { IAbstractMenuItemProps, MenuItem } from "../menu/MenuItem";

export interface INodeGraphMenuItemProps extends IAbstractMenuItemProps {
    layerId: string;
    onLayerIdChange: (layerId: string) => void;
}

export function NodeGraphMenuItem({
    onClick,
    selected,
    data,
    onChange,
    onLayerIdChange,
    layerId,
}: INodeGraphMenuItemProps) {
    return (
        <MenuItem
            icon={<BiLayer />}
            label="Create layers"
            onClick={onClick}
            selected={selected}
        >
            <>
                {data.layers.map((layer, i) => (
                    <HStack
                        mx={-6}
                        pl={6}
                        pr={3}
                        my={-1}
                        bg={layerId === layer.id ? "blue.600" : undefined}
                        _hover={{
                            bg: layerId === layer.id ? "blue.600" : "blue.700",
                        }}
                        spacing={0}
                    >
                        <HStack
                            mr={2}
                            py={4}
                            h="full"
                            flexGrow={1}
                            cursor="pointer"
                            onClick={() => onLayerIdChange(layer.id)}
                        >
                            <Text>{layer.name}</Text>
                            <Spacer />
                        </HStack>
                        <IconButton
                            aria-label="Move layer up"
                            icon={<BiUpArrowAlt />}
                            isDisabled={i === 0}
                            onClick={() => {
                                if (i === 0) return;
                                data.layers.splice(i, 1);
                                data.layers.splice(i - 1, 0, layer);
                                onChange(data);
                            }}
                            borderRightRadius={0}
                        />
                        <IconButton
                            aria-label="Move layer down"
                            icon={<BiDownArrowAlt />}
                            isDisabled={i === data.layers.length - 1}
                            onClick={() => {
                                if (i === data.layers.length - 1) return;
                                data.layers.splice(i, 1);
                                data.layers.splice(i + 1, 0, layer);
                                onChange(data);
                            }}
                            borderLeftRadius={0}
                            mr={2}
                        />
                        <IconButton
                            aria-label="Remove layer"
                            icon={<BiTrash />}
                            onClick={() => {
                                data.layers = data.layers.filter(
                                    (l) => l.id !== layer.id
                                );
                                if (data.layers.length === 0) {
                                    data.layers.push(getDefaultLayer());
                                }
                                if (layerId === layer.id) {
                                    onLayerIdChange(data.layers[0].id);
                                }
                                onChange(data);
                            }}
                        />
                    </HStack>
                ))}
                <HStack
                    mx={-6}
                    pl={6}
                    pr={3}
                    my={-1}
                    py={2}
                    cursor="pointer"
                    onClick={() => {
                        data.layers.push(getDefaultLayer());
                        onChange(data);
                        onLayerIdChange(data.layers[data.layers.length - 1].id);
                    }}
                    _hover={{
                        bg: "blue.700",
                    }}
                >
                    <BiPlus opacity={0.5} />{" "}
                    <Text opacity={0.5}>Create new layer</Text>
                </HStack>
            </>
        </MenuItem>
    );
}
