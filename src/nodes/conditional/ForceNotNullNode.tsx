import { Select } from "@chakra-ui/react";
import { NodeProps } from "reactflow";
import {
    AbstractNode,
    NodeConstructorParams,
    NodeData,
} from "../../components/AbstractNode";
import { GenericNode } from "../../components/GenericNode";
import { Variable } from "../../components/Variable";
import { varTypes } from "../../components/_varTypes";
import { GraphState } from "../../graphState/graphState";
import { Node, VarType } from "../../types/serializationTypes";
import { nodeInputStyle } from "../../utils/styles";

export class ForceNotNullNode extends AbstractNode {
    static title = "Force Not Null";
    static category = "Conditional";
    static type = "forceNotNull";

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
                    type: "float",
                    title: "Output",
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
        const created = super.deserialize(id, node) as ForceNotNullNode;

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

        // Output is never nullable
        this.outputState.output.nullable = false;
    }

    public static Component({
        data: { node, forceUpdate },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as ForceNotNullNode;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
            >
                <Select
                    {...nodeInputStyle}
                    value={thisNode.inputType}
                    onChange={(e) => {
                        thisNode.setInputType(e.target.value as any);
                        forceUpdate();
                    }}
                >
                    {Object.keys(varTypes).map((type, i) => (
                        <option
                            key={i}
                            style={{ color: "#000000" }}
                            value={type}
                        >
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
                    />
                ))}
            </GenericNode>
        );
    }
}
