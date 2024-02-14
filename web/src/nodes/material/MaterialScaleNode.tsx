import {
    Box,
    Flex,
    Icon,
    RangeSlider,
    RangeSliderThumb,
    RangeSliderTrack,
    Select,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiPlus, BiTrash } from "react-icons/bi";
import { NodeProps } from "reactflow";
import {
    AbstractNode,
    NodeConstructorParams,
    NodeData,
} from "../../components/nodeGraph/AbstractNode";
import { GenericNode } from "../../components/nodeGraph/GenericNode";
import { Texture } from "../../components/nodeGraph/Texture";
import { Variable } from "../../components/nodeGraph/Variable";
import { GraphState } from "../../graphState/graphState";
import { mcData } from "../../minecraft/mcData";
import { Node } from "../../types/layerTypes";
import { nodeInputStyle } from "../../utils/styles";

type MaterialScale = {
    from: number;
    material: string;
};

const presets: Record<
    string,
    {
        scale: MaterialScale[];
        defaultMaterial: string;
    }
> = {
    "Red to green wool": {
        defaultMaterial: "red_wool",
        scale: [
            {
                from: 0.2,
                material: "orange_wool",
            },
            {
                from: 0.4,
                material: "yellow_wool",
            },
            {
                from: 0.6,
                material: "lime_wool",
            },
            {
                from: 0.8,
                material: "green_wool",
            },
        ],
    },
    "Red to green concrete": {
        defaultMaterial: "red_concrete",
        scale: [
            {
                from: 0.2,
                material: "orange_concrete",
            },
            {
                from: 0.4,
                material: "yellow_concrete",
            },
            {
                from: 0.6,
                material: "lime_concrete",
            },
            {
                from: 0.8,
                material: "green_concrete",
            },
        ],
    },
    "White to blue": {
        defaultMaterial: "snow_block",
        scale: [
            {
                from: 0.1,
                material: "white_wool",
            },
            {
                from: 0.25,
                material: "white_concrete",
            },
            {
                from: 0.4,
                material: "light_blue_wool",
            },
            {
                from: 0.55,
                material: "light_blue_concrete",
            },
            {
                from: 0.7,
                material: "blue_wool",
            },
            {
                from: 0.85,
                material: "blue_concrete",
            },
        ],
    },
    "Wood range": {
        defaultMaterial: "smooth_sandstone",
        scale: [
            {
                from: 0.12,
                material: "birch_planks",
            },
            {
                from: 0.24,
                material: "oak_planks",
            },
            {
                from: 0.36,
                material: "jungle_planks",
            },
            {
                from: 0.48,
                material: "spruce_planks",
            },
            {
                from: 0.6,
                material: "dark_oak_planks",
            },
            {
                from: 0.72,
                material: "nether_bricks",
            },
            {
                from: 0.84,
                material: "black_terracotta",
            },
        ],
    },
};

export class MaterialScaleNode extends AbstractNode {
    static title = "Material Scale";
    static category = "Material";
    static type = "materialScale";

    private scale: MaterialScale[] = [
        {
            from: 0.4,
            material: "yellow_wool",
        },
        {
            from: 0.6,
            material: "green_wool",
        },
    ];

    private defaultMaterial = "red_wool";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                min: {
                    type: "float",
                    title: "Minimum value",
                },
                max: {
                    type: "float",
                    title: "Maximum value",
                },
                input: {
                    type: "float",
                    title: "Value",
                },
            },
            {
                output: {
                    type: "material",
                    title: "Material",
                },
            },
            params
        );
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);

        // If any input is nullable, all outputs are nullable
        const inputNullable = Object.values(this.inputState).some(
            (state) => state.nullable
        );

        this.outputState.output.nullable = inputNullable;
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as MaterialScaleNode;

        if (node.nodeData.scale) {
            created.scale = node.nodeData.scale;
        }
        if (node.nodeData.defaultMaterial) {
            created.defaultMaterial = node.nodeData.defaultMaterial;
        }

        return created;
    }

    public serializeNodeData(): Record<string, any> {
        return {
            scale: this.scale,
            defaultMaterial: this.defaultMaterial,
        };
    }

    public static Component({
        data: { node, forceUpdate, locked },
        selected,
    }: NodeProps<NodeData>) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isOverControls, setIsOverControls] = useState(false);
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as MaterialScaleNode;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
                w={96}
                locked={locked}
                helpPath="/nodes/material/materialScale"
            >
                <Select
                    {...nodeInputStyle}
                    value={
                        Object.entries(presets).find(
                            ([key, value]) =>
                                value.scale === thisNode.scale &&
                                value.defaultMaterial ===
                                    thisNode.defaultMaterial
                        )?.[0] || "Custom"
                    }
                    onChange={(e) => {
                        const preset = e.target.value;
                        if (preset && presets[preset]) {
                            thisNode.scale = presets[preset].scale;
                            thisNode.defaultMaterial =
                                presets[preset].defaultMaterial;
                        }
                        forceUpdate();
                    }}
                >
                    <option value={"Custom"}>Custom</option>
                    {Object.keys(presets).map((key, i) => (
                        <option key={i} value={key}>
                            {key}
                        </option>
                    ))}
                </Select>
                <Box position="relative" w={80} mx="auto">
                    <RangeSlider
                        mt={8}
                        mb={8}
                        h={4}
                        step={0.01}
                        min={0}
                        max={1}
                        value={thisNode.scale.map((scale) => scale.from)}
                        onChange={(value) => {
                            thisNode.scale = value.map((from, i) => ({
                                from,
                                material: thisNode.scale[i].material,
                            }));
                            forceUpdate();
                        }}
                    >
                        <RangeSliderTrack></RangeSliderTrack>
                        {thisNode.scale.map((_, i) => (
                            <RangeSliderThumb index={i} />
                        ))}
                    </RangeSlider>
                    <Box
                        position="absolute"
                        top="1"
                        left="0"
                        right="0"
                        height="6"
                        onPointerEnter={() => setIsOverControls(true)}
                        onPointerLeave={() => setIsOverControls(false)}
                    >
                        {thisNode.scale.map((scale, i) => (
                            <Box
                                position="absolute"
                                top="0"
                                left={`${scale.from * 100}%`}
                                textAlign="center"
                                ml="-6"
                                w="12"
                            >
                                {isOverControls ? (
                                    <Icon
                                        cursor="pointer"
                                        as={BiTrash}
                                        onClick={() => {
                                            thisNode.scale.splice(i, 1);
                                            forceUpdate();
                                        }}
                                    />
                                ) : (
                                    <Text>{Math.floor(scale.from * 100)}%</Text>
                                )}
                            </Box>
                        ))}
                        {isOverControls && (
                            <>
                                {thisNode.scale.map((scale, i) => (
                                    <Box
                                        position="absolute"
                                        top="0"
                                        left={`${
                                            ((scale.from +
                                                (i === thisNode.scale.length - 1
                                                    ? 1.05
                                                    : thisNode.scale[i + 1]
                                                          .from)) /
                                                2) *
                                            100
                                        }%`}
                                        textAlign="center"
                                        ml="-3"
                                        w="6"
                                    >
                                        <Icon
                                            cursor="pointer"
                                            as={BiPlus}
                                            onClick={() => {
                                                thisNode.scale.splice(
                                                    i + 1,
                                                    0,
                                                    {
                                                        from:
                                                            (scale.from +
                                                                (i ===
                                                                thisNode.scale
                                                                    .length -
                                                                    1
                                                                    ? 1.05
                                                                    : thisNode
                                                                          .scale[
                                                                          i + 1
                                                                      ].from)) /
                                                            2,
                                                        material: "white_wool",
                                                    }
                                                );
                                                forceUpdate();
                                            }}
                                        />
                                    </Box>
                                ))}
                                <Box
                                    position="absolute"
                                    top="0"
                                    left={`${
                                        ((-0.05 +
                                            (thisNode.scale.length > 0
                                                ? thisNode.scale[0].from
                                                : 1.05)) /
                                            2) *
                                        100
                                    }%`}
                                    textAlign="center"
                                    ml="-3"
                                    w="6"
                                >
                                    <Icon
                                        cursor="pointer"
                                        as={BiPlus}
                                        onClick={() => {
                                            thisNode.scale.splice(0, 0, {
                                                from:
                                                    (0 +
                                                        (thisNode.scale.length >
                                                        0
                                                            ? thisNode.scale[0]
                                                                  .from
                                                            : 1)) /
                                                    2,
                                                material: "white_wool",
                                            });
                                            forceUpdate();
                                        }}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                    <MaterialSelect
                        value={
                            (-0.05 +
                                (thisNode.scale.length > 0
                                    ? thisNode.scale[0].from
                                    : 1.05)) /
                            2
                        }
                        material={thisNode.defaultMaterial}
                        onChange={(materal) => {
                            thisNode.defaultMaterial = materal;
                            forceUpdate();
                        }}
                    />
                    {thisNode.scale.map((scale, i) => (
                        <MaterialSelect
                            material={scale.material}
                            value={
                                (scale.from +
                                    (i === thisNode.scale.length - 1
                                        ? 1.05
                                        : thisNode.scale[i + 1].from)) /
                                2
                            }
                            onChange={(materal) => {
                                thisNode.scale[i].material = materal;
                                forceUpdate();
                            }}
                        />
                    ))}
                </Box>
                {Object.entries(node.inputs).map(([id, input]) => (
                    <Variable
                        key={id}
                        orientation="input"
                        param={id}
                        definition={input}
                        state={node.inputState[id]}
                        locked={locked}
                        onChange={(value) => {
                            node.inputState[id].value = value;
                            forceUpdate();
                        }}
                    />
                ))}
                {Object.entries(node.outputs).map(([id, output]) => (
                    <Variable
                        key={id}
                        orientation="output"
                        param={id}
                        definition={output}
                        state={node.outputState[id]}
                        locked={locked}
                    />
                ))}
            </GenericNode>
        );
    }
}

interface IMaterialSelectProps {
    material: string;
    value: number;
    onChange: (material: string) => void;
}

function MaterialSelect({ material, value, onChange }: IMaterialSelectProps) {
    return (
        <Flex
            direction="column"
            position="absolute"
            top={10}
            left={`${value * 100}%`}
            w="6"
            transform="translateX(-50%)"
            alignItems="center"
            mt={2}
            textAlign="center"
        >
            <Texture material={material} w={6} h={6} showText />
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    cursor: "pointer",
                }}
            >
                {mcData
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
            </select>
        </Flex>
    );
}
