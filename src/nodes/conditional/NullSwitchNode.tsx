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
} from "../../components/AbstractNode";
import { GenericNode } from "../../components/GenericNode";
import { Variable } from "../../components/Variable";
import { varTypes } from "../../components/_varTypes";
import { GraphState } from "../../graphState/graphState";
import { Input, Node, VarType } from "../../types/serializationTypes";
import { incremental } from "../../utils/incremental";
import { nodeDescriptionStype, nodeInputStyle } from "../../utils/styles";

export class NullSwitchNode extends AbstractNode {
    static title = "Null Switch";
    static category = "Conditional";
    static type = "nullSwitch";

    inputType: VarType = "float";
    cases: number = 1;

    public constructor(params: NodeConstructorParams) {
        super(
            {
                "0_case": {
                    type: "float",
                    title: "Case",
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
            ...incremental(this.cases).reduce((acc, i) => {
                acc[`${i}_case`] = {
                    type: this.inputType,
                    title: "Case",
                };
                return acc;
            }, {} as HandlesDefinition),
        };
        this.inputState = {
            ...incremental(this.cases).reduce((acc, i) => {
                acc[`${i}_case`] = this.inputState[`${i}_case`] || {
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
        for (let i = 0; i < this.cases; i++) {
            this.setInputType(type, `${i}_case`, disconnect);
        }
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as NullSwitchNode;

        if (node.nodeData.inputType) {
            created.setInputTypes(created.inputType, false);
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

        // If all inputs are nullable, all outputs are nullable
        const inputNullable = Object.entries(this.inputState).every(
            ([key, state]) => state.nullable
        );

        this.outputState.output.nullable = inputNullable;
    }

    public static Component({
        data: { node, forceUpdate, updateConnections },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as NullSwitchNode;

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
                <Box h={4} />
                {incremental(thisNode.cases).map((i) => (
                    <Variable
                        key={`${i}_case`}
                        orientation="input"
                        param={`${i}_case`}
                        definition={node.inputs[`${i}_case`]}
                        state={node.inputState[`${i}_case`]}
                    />
                ))}

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
