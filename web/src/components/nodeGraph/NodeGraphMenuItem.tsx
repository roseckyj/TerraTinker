import { Button, Flex, HStack, Spacer, Text, useToast } from "@chakra-ui/react";
import {
    BiDownArrowAlt,
    BiHide,
    BiImport,
    BiLayer,
    BiPlus,
    BiShow,
    BiStoreAlt,
    BiTrash,
    BiUpArrowAlt,
} from "react-icons/bi";
import { v4 } from "uuid";
import { getDefaultLayer } from "../../data/getDefaultGeneratorData";
import { openFile } from "../../utils/openFile";
import { useHelp } from "../help/HelpProvider";
import { WithHelp } from "../help/WithHelp";
import { IAbstractMenuItemProps, MenuItem } from "../menu/MenuItem";
import { ConfirmButton } from "../utils/ConfirmButton";
import { IconButtonTooltip } from "../utils/IconButtonTooltip";

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
    const toast = useToast();
    const help = useHelp();

    return (
        <WithHelp path={`/layers`}>
            <MenuItem
                icon={<BiLayer />}
                label="Create layers"
                onClick={onClick}
                selected={selected}
            >
                <>
                    {data.layers.map((layer, i) => (
                        <HStack
                            key={i}
                            mx={-6}
                            pl={6}
                            pr={3}
                            my={-1}
                            bg={layerId === layer.id ? "blue.600" : undefined}
                            _hover={{
                                bg:
                                    layerId === layer.id
                                        ? "blue.600"
                                        : "blue.700",
                            }}
                            spacing={0}
                            opacity={layer.disabled ? 0.5 : 1}
                        >
                            <HStack
                                mr={2}
                                py={4}
                                h="full"
                                flex={1}
                                minW={0}
                                cursor="pointer"
                                onClick={() => onLayerIdChange(layer.id)}
                            >
                                <Text
                                    maxW="full"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                    opacity={layer.disabled ? 0.5 : 1}
                                >
                                    {layer.name}
                                </Text>
                                <Spacer />
                            </HStack>
                            <IconButtonTooltip
                                aria-label="Move layer up"
                                size="sm"
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
                            <IconButtonTooltip
                                aria-label="Move layer down"
                                size="sm"
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
                            <IconButtonTooltip
                                aria-label={
                                    layer.disabled
                                        ? "Enable layer"
                                        : "Disable layer"
                                }
                                size="sm"
                                icon={layer.disabled ? <BiHide /> : <BiShow />}
                                onClick={() => {
                                    layer.disabled = !layer.disabled;
                                    layer.id = v4();
                                    onChange(data);
                                    onLayerIdChange(layer.id);
                                }}
                                mr={2}
                            />
                            <ConfirmButton
                                type="IconButton"
                                label="Remove layer"
                                modalTitle="Do you want to remove this layer?"
                                modalSubtitle="This will remove the layer and all its contents."
                                size="sm"
                                icon={<BiTrash />}
                                onConfirm={() => {
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
                    <Flex
                        direction="row"
                        mt={5}
                        mx={-6}
                        py={2}
                        alignItems="middle"
                        justifyContent="center"
                        gap={2}
                    >
                        <IconButtonTooltip
                            icon={<BiStoreAlt />}
                            aria-label="Browse templates"
                            flexShrink={0}
                            onClick={() => help.onOpen("/samples")}
                        />
                        <IconButtonTooltip
                            icon={<BiImport />}
                            aria-label="Import layer"
                            flexShrink={0}
                            onClick={async () => {
                                try {
                                    const text = (await openFile(
                                        ".json"
                                    )) as string;
                                    const parsed = JSON.parse(text);
                                    parsed.id = v4();

                                    data.layers.push(parsed);
                                    onChange(data);
                                    onLayerIdChange(
                                        data.layers[data.layers.length - 1].id
                                    );
                                } catch (e) {
                                    toast({
                                        title: "Failed to import",
                                        description: (e as any).message,
                                        status: "error",
                                    });
                                }
                            }}
                        />
                        <Button
                            leftIcon={<BiPlus />}
                            flexShrink={0}
                            onClick={() => {
                                data.layers.unshift(
                                    getDefaultLayer(
                                        `Layer ${data.layers.length + 1}`
                                    )
                                );
                                onChange(data);
                                onLayerIdChange(data.layers[0].id);
                            }}
                        >
                            Create new layer
                        </Button>
                    </Flex>
                </>
            </MenuItem>
        </WithHelp>
    );
}
