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

export class NullNode extends AbstractNode {
    static title = "Null";
    static category = "Conditional";
    static type = "null";

    outputType: VarType = "float";

    public constructor(params: NodeConstructorParams) {
        super(
            {},
            {
                output: {
                    type: "float",
                    title: "Null",
                },
            },
            params
        );
    }

    private setOutputType(type: VarType, disconnect = true) {
        this.outputType = type;
        this.outputs.output = {
            type: type,
            title: "Null",
        };
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as NullNode;

        if (node.nodeData.outputType) {
            created.setOutputType(node.nodeData.outputType, false);
        }

        return created;
    }

    public serializeNodeData(): Record<string, any> {
        return {
            outputType: this.outputType,
        };
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);

        // Output is null
        this.outputState.output.nullable = true;
    }

    public static Component({
        data: { node, forceUpdate, updateConnections, locked },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as NullNode;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
                locked={locked}
            >
                <Select
                    {...nodeInputStyle}
                    value={thisNode.outputType}
                    onChange={(e) => {
                        thisNode.setOutputType(e.target.value as any);
                        forceUpdate();
                        updateConnections();
                    }}
                >
                    {Object.keys(varTypes).map((type, i) => (
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
