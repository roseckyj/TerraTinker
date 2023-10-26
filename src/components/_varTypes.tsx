import {
    Checkbox,
    Image,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Text,
} from "@chakra-ui/react";
import { mcData, mcTextures } from "../minecraft/mcData";
import { VarType } from "../types/serializationTypes";

export const varTypes: Record<
    VarType,
    {
        title: string;
        color: string;
        editor: (
            value: any,
            onChange: (value: any) => void
        ) => JSX.Element | JSX.Element[];
        default: any;
    }
> = {
    float: {
        title: "Float",
        color: "#6786ff",
        editor: (value, onChange) => [
            <Text fontSize="0.9rem" opacity={0.5} key="1">
                #
            </Text>,
            <NumberInput
                key="2"
                ml={1}
                step={0.1}
                precision={2}
                w={24}
                variant="unstyled"
                fontSize="0.9rem"
                value={value === null ? undefined : value}
                onChange={(value) => onChange(value)}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper border="none" color="white" />
                    <NumberDecrementStepper border="none" color="white" />
                </NumberInputStepper>
            </NumberInput>,
        ],
        default: 0,
    },
    geometry: {
        title: "Geometry",
        color: "#00ad50",
        editor: () => (
            <Text fontSize="0.9rem" opacity={0.5}>
                {"{empty}"}
            </Text>
        ),
        default: null,
    },
    string: {
        title: "String",
        color: "#636363",
        editor: (value, onChange) => [
            <Text fontSize="0.9rem" opacity={0.5} key="1">
                "
            </Text>,
            <Input
                key="2"
                mx={1}
                w={36}
                variant="unstyled"
                fontSize="0.9rem"
                type="text"
                value={value === null ? undefined : value}
                onChange={(e) => onChange(e.target.value)}
            />,
            <Text fontSize="0.9rem" opacity={0.5} key="3">
                "
            </Text>,
        ],
        default: "",
    },
    material: {
        title: "Material",
        color: "#fffa63",
        editor: (value, onChange) => [
            <Image
                key="1"
                src={
                    (mcTextures as any)[`minecraft:${value}`]
                        ? (mcTextures as any)[`minecraft:${value}`]?.texture
                        : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" /* Transparent pixel */
                }
                w={5}
                h={5}
                my="auto"
                mr={1}
                ml={-1}
            />,
            <Select
                key="2"
                w={36}
                variant="unstyled"
                fontSize="0.9rem"
                value={value === null ? undefined : value}
                onChange={(e) => onChange(e.target.value)}
            >
                {mcData.blocksArray
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .map((block, i) => (
                        <option
                            key={i}
                            style={{ color: "#000000" }}
                            value={block.name}
                        >
                            {block.displayName}
                        </option>
                    ))}
            </Select>,
        ],
        default: "air",
    },
    boolean: {
        title: "Boolean",
        color: "#ff6d54",
        editor: (value, onChange) => (
            <Checkbox
                isChecked={!!value}
                onChange={(event) => onChange(event.target.checked)}
            />
        ),
        default: false,
    },
    raster: {
        title: "Raster",
        color: "#ff5ebc",
        editor: () => (
            <Text fontSize="0.9rem" opacity={0.5}>
                {"[empty]"}
            </Text>
        ),
        default: null,
    },
};
