import { Select } from "@chakra-ui/react";
import { NodeProps } from "reactflow";
import {
    AbstractNode,
    NodeConstructorParams,
    NodeData,
} from "../../components/AbstractNode";
import { FlowHandles } from "../../components/FlowHandles";
import { GenericNode } from "../../components/GenericNode";
import { Variable } from "../../components/Variable";
import { GraphState } from "../../graphState/graphState";
import { Node } from "../../types/serializationTypes";
import { capitalize } from "../../utils/capitalize";
import { nodeInputStyle } from "../../utils/styles";

const treeTypes = [
    "tree",
    "big tree",
    "redwood",
    "tall redwood",
    "birch",
    "jungle",
    "small jungle",
    "cocoa tree",
    "jungle bush",
    "red mushroom",
    "brown mushroom",
    "swamp",
    "acacia",
    "dark oak",
    "mega redwood",
    "tall birch",
    "chorus plant",
    "crimson fungus",
    "warped fungus",
    "azalea",
];

export class PlaceTreeNode extends AbstractNode {
    static title = "Place Tree";
    static category = "Minecraft";
    static type = "placeTree";
    static isAction = true;

    private treeType: string = "oak";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                x: {
                    type: "float",
                    title: "X",
                },
                y: {
                    type: "float",
                    title: "Y",
                },
                z: {
                    type: "float",
                    title: "Z",
                },
                ignore: {
                    type: "boolean",
                    title: "Ignore",
                },
            },
            {},
            params
        );
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as PlaceTreeNode;

        if (node.nodeData.treeType) {
            created.treeType = node.nodeData.treeType;
        }

        return created;
    }

    public serializeNodeData(): Record<string, any> {
        return {
            treeType: this.treeType,
        };
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);
    }

    public static Component({
        data: { node, forceUpdate },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as PlaceTreeNode;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
                tags={["action"]}
            >
                <Select
                    {...nodeInputStyle}
                    value={thisNode.treeType}
                    onChange={(e) => {
                        thisNode.treeType = e.target.value as any;
                        forceUpdate();
                    }}
                >
                    {treeTypes.map((type, i) => (
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
                <FlowHandles node={node} />
            </GenericNode>
        );
    }
}
