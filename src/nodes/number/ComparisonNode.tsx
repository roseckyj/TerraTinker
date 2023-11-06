import { Select } from "@chakra-ui/react";
import { NodeProps } from "reactflow";
import {
    AbstractNode,
    NodeConstructorParams,
    NodeData,
} from "../../components/nodeGraph/AbstractNode";
import { GenericNode } from "../../components/nodeGraph/GenericNode";
import { Variable } from "../../components/nodeGraph/Variable";
import { GraphState } from "../../graphState/graphState";
import { Node } from "../../types/serializationTypes";
import { capitalize } from "../../utils/capitalize";
import { nodeInputStyle } from "../../utils/styles";

const allowedOperators = [
    "equal",
    "not equal",
    "greater",
    "less",
    "greater or equal",
    "less or equal",
];

export class ComparisonNode extends AbstractNode {
    static title = "Compare";
    static category = "Number";
    static type = "comparison";

    operator: string = "add";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                a: {
                    type: "float",
                    title: "A",
                },
                b: {
                    type: "float",
                    title: "B",
                },
            },
            {
                output: {
                    type: "boolean",
                    title: "Result",
                },
            },
            params
        );
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as ComparisonNode;

        if (node.nodeData.operator) {
            created.operator = node.nodeData.operator;
        }

        return created;
    }

    public serializeNodeData(): Record<string, any> {
        return {
            operator: this.operator,
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
        data: { node, forceUpdate },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as ComparisonNode;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
            >
                <Select
                    {...nodeInputStyle}
                    value={thisNode.operator}
                    onChange={(e) => {
                        thisNode.operator = e.target.value as any;
                        forceUpdate();
                    }}
                >
                    {allowedOperators.map((type, i) => (
                        <option key={i} value={type}>
                            {capitalize(type)}
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
