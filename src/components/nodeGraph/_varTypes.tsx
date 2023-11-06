import {
    Checkbox,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Text,
} from "@chakra-ui/react";
import { mcData } from "../../minecraft/mcData";
import { VarType } from "../../types/serializationTypes";
import { Texture } from "./Texture";

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
        serialize: (value: any) => any;
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
        serialize: (value) => {
            switch (typeof value) {
                case "number":
                    return value;
                case "string":
                    return parseFloat(value);
                default:
                    return varTypes.float.default;
            }
        },
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
        serialize: (value) => null,
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
        serialize: (value) => {
            switch (typeof value) {
                case "string":
                    return value;
                default:
                    return varTypes.string.default;
            }
        },
    },
    material: {
        title: "Material",
        color: "#fffa63",
        editor: (value, onChange) => [
            <Texture
                material={value}
                key="1"
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
                        <option key={i} value={block.name}>
                            {block.displayName}
                        </option>
                    ))}
            </Select>,
        ],
        default: "air",
        serialize: (value) => {
            switch (typeof value) {
                case "string":
                    return value;
                default:
                    return varTypes.material.default;
            }
        },
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
        serialize: (value) => {
            switch (typeof value) {
                case "boolean":
                    return value;
                default:
                    return varTypes.boolean.default;
            }
        },
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
        serialize: (value) => null,
    },
};
