import { Select } from "@chakra-ui/react";
import { NodeProps } from "reactflow";
import {
    AbstractNode,
    NodeConstructorParams,
    NodeData,
} from "../../components/nodeGraph/AbstractNode";
import { GenericNode } from "../../components/nodeGraph/GenericNode";
import { Variable } from "../../components/nodeGraph/Variable";
import { varTypes } from "../../components/nodeGraph/_varTypes";
import { GraphState } from "../../graphState/graphState";
import { Node, VarType } from "../../types/layerTypes";
import { nodeInputStyle } from "../../utils/styles";

const allowedTypes = ["float", "boolean", "material"];

export class ToStringNode extends AbstractNode {
    static title = "To String";
    static category = "String";
    static type = "toString";

    inputType: VarType = "float";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                input: {
                    type: "float",
                    title: "Input",
                },
            },
            {
                output: {
                    type: "string",
                    title: "String",
                },
            },
            params
        );
    }

    private setInputType(type: VarType, disconnect = true) {
        this.inputType = type;
        this.inputs.input = {
            type: type,
            title: "Input",
        };
        if (!this.inputState.input.nodeId) {
            this.inputState.input.value = varTypes[type].default;
        } else if (disconnect) {
            this.inputState.input.nodeId = null;
            this.inputState.input.handleId = null;
        }
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as ToStringNode;

        if (node.nodeData.inputType) {
            created.setInputType(node.nodeData.inputType, false);
        }

        return created;
    }

    public serializeNodeData(): Record<string, any> {
        return {
            inputType: this.inputType,
        };
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);

        // If any input is nullable, all outputs are nullable
        const inputNullable = Object.values(this.inputState).some(
            (state) => state.nullable
        );

        this.outputState.output.nullable = inputNullable;
    }

    public static Component({
        data: { node, forceUpdate, locked },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as ToStringNode;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
                locked={locked}
            >
                <Select
                    {...nodeInputStyle}
                    value={thisNode.inputType}
                    onChange={(e) => {
                        thisNode.setInputType(e.target.value as any);
                        forceUpdate();
                    }}
                >
                    {allowedTypes.map((type, i) => (
                        <option key={i} value={type}>
                            {(varTypes as any)[type].title}
                        </option>
                    ))}
                </Select>
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
