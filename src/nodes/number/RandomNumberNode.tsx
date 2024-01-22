import { Checkbox } from "@chakra-ui/react";
import { NodeProps } from "reactflow";
import {
    AbstractNode,
    NodeConstructorParams,
    NodeData,
} from "../../components/nodeGraph/AbstractNode";
import { GenericNode } from "../../components/nodeGraph/GenericNode";
import { Variable } from "../../components/nodeGraph/Variable";
import { GraphState } from "../../graphState/graphState";
import { Node } from "../../types/layerTypes";

export class RandomNumberNode extends AbstractNode {
    static title = "Random Number";
    static category = "Number";
    static type = "randomNumber";

    private randomSeed: boolean = true;

    public constructor(params: NodeConstructorParams) {
        super(
            {
                decimal: {
                    type: "boolean",
                    title: "Decimal number",
                },
                from: {
                    type: "float",
                    title: "From",
                },
                to: {
                    type: "float",
                    title: "To",
                },
                seed: {
                    type: "float",
                    title: "Seed (random if null)",
                },
            },
            {
                output: {
                    type: "float",
                    title: "Number",
                },
            },
            params
        );
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as RandomNumberNode;

        if (node.nodeData.randomSeed !== undefined) {
            created.randomSeed = node.nodeData.randomSeed;
        }

        return created;
    }

    public serializeNodeData(): Record<string, any> {
        return {
            randomSeed: this.randomSeed,
        };
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);

        const inputNullable =
            this.inputState.from.nullable || this.inputState.to.nullable;

        this.outputState.output.nullable = inputNullable;
    }

    public static Component({
        data: { node, forceUpdate, locked },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as RandomNumberNode;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
                locked={locked}
            >
                <Checkbox
                    isChecked={thisNode.randomSeed}
                    onChange={(e) => {
                        thisNode.randomSeed = e.target.checked;
                        forceUpdate();
                    }}
                >
                    Random seed
                </Checkbox>
                <Variable
                    key={"decimal"}
                    orientation="input"
                    param={"decimal"}
                    definition={thisNode.inputs["decimal"]}
                    state={node.inputState["decimal"]}
                    locked={locked}
                    onChange={(value) => {
                        node.inputState["decimal"].value = value;
                        forceUpdate();
                    }}
                />
                <Variable
                    key={"from"}
                    orientation="input"
                    param={"from"}
                    definition={thisNode.inputs["from"]}
                    state={node.inputState["from"]}
                    locked={locked}
                    onChange={(value) => {
                        node.inputState["from"].value = value;
                        forceUpdate();
                    }}
                />
                <Variable
                    key={"to"}
                    orientation="input"
                    param={"to"}
                    definition={thisNode.inputs["to"]}
                    state={node.inputState["to"]}
                    locked={locked}
                    onChange={(value) => {
                        node.inputState["to"].value = value;
                        forceUpdate();
                    }}
                />
                {!thisNode.randomSeed && (
                    <Variable
                        key={"seed"}
                        orientation="input"
                        param={"seed"}
                        definition={thisNode.inputs["seed"]}
                        state={node.inputState["seed"]}
                        locked={locked}
                        onChange={(value) => {
                            node.inputState["seed"].value = value;
                            forceUpdate();
                        }}
                    />
                )}
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
