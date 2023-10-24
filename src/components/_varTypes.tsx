import { Checkbox, Input, Select, Text } from "@chakra-ui/react";
import minecraftData from "minecraft-data";
import { VarType } from "../types/serializationTypes";

export const mcData = minecraftData("1.18");

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
            <Text fontSize="0.9rem" opacity={0.5}>
                #
            </Text>,
            <Input
                ml={1}
                type="number"
                step="0.1"
                w={16}
                variant="unstyled"
                fontSize="0.9rem"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />,
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
            <Text fontSize="0.9rem" opacity={0.5}>
                "
            </Text>,
            <Input
                mx={1}
                w={36}
                variant="unstyled"
                fontSize="0.9rem"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />,
            <Text fontSize="0.9rem" opacity={0.5}>
                "
            </Text>,
        ],
        default: "",
    },
    material: {
        title: "Material",
        color: "#fffa63",
        editor: (value, onChange) => (
            <Select
                w={36}
                variant="unstyled"
                fontSize="0.9rem"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {mcData.blocksArray
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .map((block) => (
                        <option style={{ color: "#000000" }} value={block.name}>
                            {block.displayName}
                        </option>
                    ))}
            </Select>
        ),
        default: "air",
    },
    boolean: {
        title: "Boolean",
        color: "#ff6d54",
        editor: (value, onChange) => (
            <Checkbox
                isChecked={value}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
        default: false,
    },
};
