import {
    Box,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Text,
} from "@chakra-ui/react";
import { NodeProps } from "reactflow";
import {
    AbstractNode,
    HandlesDefinition,
    InputState,
    NodeConstructorParams,
    NodeData,
} from "../../components/nodeGraph/AbstractNode";
import { GenericNode } from "../../components/nodeGraph/GenericNode";
import { Variable } from "../../components/nodeGraph/Variable";
import { varTypes } from "../../components/nodeGraph/_varTypes";
import { GraphState } from "../../graphState/graphState";
import { Input, Node, VarType } from "../../types/layerTypes";
import { incremental } from "../../utils/incremental";
import { nodeDescriptionStype, nodeInputStyle } from "../../utils/styles";

const allowedSwitchTypes = ["float", "boolean", "material", "string"];

export class SwitchNode extends AbstractNode {
    static title = "Switch";
    static category = "Conditional";
    static type = "switch";

    inputType: VarType = "float";
    switchType: VarType = "string";
    cases: number = 1;

    public constructor(params: NodeConstructorParams) {
        super(
            {
                value: {
                    type: "string",
                    title: "Switch value",
                },
                default: {
                    type: "float",
                    title: "Default",
                },
            },
            {
                output: {
                    type: "float",
                    title: "Result",
                },
            },
            params
        );
        this.updateSwitchConnections();
    }

    private updateSwitchConnections() {
        this.inputs = {
            value: {
                type: this.switchType,
                title: "Switch value",
            },
            default: {
                type: this.inputType,
                title: "Default",
            },
            ...incremental(this.cases).reduce((acc, i) => {
                acc[`${i}_case`] = {
                    type: this.switchType,
                    title: "Case",
                };
                acc[`${i}_use`] = {
                    type: this.inputType,
                    title: "Use",
                };
                return acc;
            }, {} as HandlesDefinition),
        };
        this.inputState = {
            value: this.inputState.value,
            default: this.inputState.default,
            ...incremental(this.cases).reduce((acc, i) => {
                acc[`${i}_case`] = this.inputState[`${i}_case`] || {
                    nodeId: null,
                    handleId: null,
                    value: varTypes[this.switchType].default,
                    nullable: false,
                };
                acc[`${i}_use`] = this.inputState[`${i}_use`] || {
                    nodeId: null,
                    handleId: null,
                    value: varTypes[this.inputType].default,
                    nullable: false,
                };
                return acc;
            }, {} as Record<string, InputState>),
        };

        this.outputs = {
            output: {
                type: this.inputType,
                title: "Result",
            },
        };

        this.updateLocalConnections();
    }

    private setInputType(type: VarType, key: string, disconnect = true) {
        this.inputs[key].type = type;
        if (!this.inputState[key].nodeId) {
            this.inputState[key].value = varTypes[type].default;
        } else if (disconnect) {
            this.inputState[key].nodeId = null;
            this.inputState[key].handleId = null;
        }
        this.updateSwitchConnections();
    }

    private setInputTypes(type: VarType, disconnect = true) {
        this.inputType = type;
        this.setInputType(type, "default", disconnect);
        for (let i = 0; i < this.cases; i++) {
            this.setInputType(type, `${i}_use`, disconnect);
        }
    }

    private setSwitchTypes(type: VarType, disconnect = true) {
        this.switchType = type;
        this.setInputType(type, "value", disconnect);
        for (let i = 0; i < this.cases; i++) {
            this.setInputType(type, `${i}_case`, disconnect);
        }
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as SwitchNode;

        if (node.nodeData.inputType) {
            created.setInputTypes(created.inputType, false);
        }
        if (node.nodeData.switchType) {
            created.setSwitchTypes(created.switchType, false);
        }
        if (node.nodeData.cases) {
            created.cases = node.nodeData.cases;
            created.updateSwitchConnections();
        }

        created.inputState = Object.keys(created.inputs).reduce((prev, key) => {
            const inputValue: Input | null = node.inputs[key];

            return {
                ...prev,
                [key]:
                    inputValue && inputValue.kind === "link"
                        ? {
                              value: null,
                              nodeId: (inputValue as any).node,
                              handleId: (inputValue as any).output,
                              nullable: false,
                          }
                        : {
                              value: inputValue
                                  ? (inputValue as any).value
                                  : varTypes[created.inputs[key].type].default,
                              nodeId: null,
                              handleId: null,
                              nullable: false,
                          },
            };
        }, {});

        return created;
    }

    public serializeNodeData(): Record<string, any> {
        return {
            inputType: this.inputType,
            switchType: this.switchType,
            cases: this.cases,
        };
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);

        this.updateLocalConnections();
    }

    private updateLocalConnections() {
        Object.keys(this.inputState).forEach((key) => {
            if (!this.inputState[key].nodeId) {
                this.inputState[key].nullable = false;
            }
        });

        // If any input is nullable, all outputs are nullable
        const inputNullable = Object.entries(this.inputState).some(
            ([key, state]) =>
                state.nullable &&
                (key === "value" || key === "default" || key.endsWith("_use"))
        );

        this.outputState.output.nullable = inputNullable;
    }

    public static Component({
        data: { node, forceUpdate, updateConnections },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as SwitchNode;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
            >
                <Text {...nodeDescriptionStype}>Number of cases</Text>
                <NumberInput
                    {...nodeInputStyle}
                    value={thisNode.cases}
                    step={1}
                    min={1}
                    mb={2}
                    onChange={(value) => {
                        thisNode.cases = parseInt(value);
                        thisNode.updateSwitchConnections();
                        forceUpdate();
                    }}
                >
                    <NumberInputField bg="none" _hover={{ bg: "none" }} />
                    <NumberInputStepper>
                        <NumberIncrementStepper border="none" color="white" />
                        <NumberDecrementStepper border="none" color="white" />
                    </NumberInputStepper>
                </NumberInput>
                <Text {...nodeDescriptionStype}>Switch type</Text>
                <Select
                    {...nodeInputStyle}
                    value={thisNode.switchType}
                    mb={2}
                    onChange={(e) => {
                        thisNode.setSwitchTypes(e.target.value as any);
                        forceUpdate();
                        updateConnections();
                    }}
                >
                    {allowedSwitchTypes.map((type, i) => (
                        <option key={i} value={type}>
                            {(varTypes as any)[type].title}
                        </option>
                    ))}
                </Select>
                <Text {...nodeDescriptionStype}>Use type</Text>
                <Select
                    {...nodeInputStyle}
                    value={thisNode.inputType}
                    mb={2}
                    onChange={(e) => {
                        thisNode.setInputTypes(e.target.value as any);
                        forceUpdate();
                        updateConnections();
                    }}
                >
                    {Object.entries(varTypes).map(([type, def], i) => (
                        <option key={i} value={type}>
                            {def.title}
                        </option>
                    ))}
                </Select>
                <Variable
                    key={"value"}
                    orientation="input"
                    param={"value"}
                    definition={node.inputs["value"]}
                    state={node.inputState["value"]}
                    onChange={(value) => {
                        node.inputState["value"].value = value;
                        forceUpdate();
                    }}
                />
                <Box h={4} />
                {incremental(thisNode.cases).map((i) => (
                    <Box key={i} mb={4}>
                        <Text {...nodeDescriptionStype}>Option {i + 1}</Text>
                        <Variable
                            key={`${i}_case`}
                            orientation="input"
                            param={`${i}_case`}
                            definition={node.inputs[`${i}_case`]}
                            state={node.inputState[`${i}_case`]}
                            onChange={(value) => {
                                node.inputState[`${i}_case`].value = value;
                                forceUpdate();
                            }}
                        />
                        <Variable
                            key={`${i}_use`}
                            orientation="input"
                            param={`${i}_use`}
                            definition={node.inputs[`${i}_use`]}
                            state={node.inputState[`${i}_use`]}
                            onChange={(value) => {
                                node.inputState[`${i}_use`].value = value;
                                forceUpdate();
                            }}
                        />
                    </Box>
                ))}
                <Variable
                    key="default"
                    orientation="input"
                    param="default"
                    definition={node.inputs["default"]}
                    state={node.inputState["default"]}
                    onChange={(value) => {
                        node.inputState["default"].value = value;
                        forceUpdate();
                    }}
                />

                {Object.entries(node.outputs).map(([id, output]) => (
                    <Variable
                        key={id}
                        orientation="output"
                        param={id}
                        definition={output}
                        state={node.outputState[id]}
                    />
                ))}
            </GenericNode>
        );
    }
}
