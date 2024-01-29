import {
    Button,
    Flex,
    HStack,
    IconButton,
    Spacer,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import {
    BiCloudUpload,
    BiDownArrowAlt,
    BiLayer,
    BiPlus,
    BiStoreAlt,
    BiTrash,
    BiUpArrowAlt,
} from "react-icons/bi";
import { getDefaultLayer } from "../../data/getDefaultGeneratorData";
import { WithHelp } from "../help/WithHelp";
import { IAbstractMenuItemProps, MenuItem } from "../menu/MenuItem";
import { Store } from "./store/Store";

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
    const { isOpen, onOpen, onClose } = useDisclosure();

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
                    <Flex
                        direction="row"
                        mt={5}
                        mx={-6}
                        py={2}
                        alignItems="middle"
                        justifyContent="center"
                        gap={2}
                    >
                        <IconButton
                            icon={<BiStoreAlt />}
                            aria-label="Browse templates"
                            flexShrink={0}
                            onClick={onOpen}
                        />
                        <IconButton
                            icon={<BiCloudUpload />}
                            aria-label="Import"
                            flexShrink={0}
                            onClick={() => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = ".json";

                                input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement)
                                        .files![0];
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        try {
                                            const text = e.target!
                                                .result as string;
                                            const parsed = JSON.parse(text);

                                            data.layers.push(parsed);
                                            onChange(data);
                                            onLayerIdChange(
                                                data.layers[
                                                    data.layers.length - 1
                                                ].id
                                            );
                                        } catch (e) {
                                            toast({
                                                title: "Failed to import",
                                                description: (e as any).message,
                                                status: "error",
                                            });
                                        }

                                        input.remove();
                                    };
                                    reader.readAsText(file);
                                };

                                input.click();
                            }}
                        />
                        <Button
                            leftIcon={<BiPlus />}
                            flexShrink={0}
                            onClick={() => {
                                data.layers.push(getDefaultLayer());
                                onChange(data);
                                onLayerIdChange(
                                    data.layers[data.layers.length - 1].id
                                );
                            }}
                        >
                            Create new layer
                        </Button>
                    </Flex>
                </>
                <Store
                    onCancel={onClose}
                    onCreate={(layer) => {
                        data.layers.push(layer);
                        onChange(data);
                        onLayerIdChange(layer.id);
                        onClose();
                    }}
                    isOpen={isOpen}
                />
            </MenuItem>
        </WithHelp>
    );
}
