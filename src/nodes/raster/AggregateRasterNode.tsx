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

const possibleAggregations = ["min", "max", "average"];

export class AggregateRasterNode extends AbstractNode {
    static title = "Aggregate Raster";
    static category = "Raster";
    static type = "aggregateRaster";

    private aggregation: string = "bilinear";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                raster: {
                    type: "raster",
                    title: "Raster",
                },
                geometry: {
                    type: "geometry",
                    title: "Geometry",
                },
            },
            {
                value: {
                    type: "float",
                    title: "Sampled value",
                },
            },
            params
        );
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);

        this.outputState.value.nullable = true;
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as AggregateRasterNode;

        if (node.nodeData.aggregation) {
            created.aggregation = node.nodeData.aggregation;
        }

        return created;
    }

    public serializeNodeData(): Record<string, any> {
        return {
            aggregation: this.aggregation,
        };
    }

    public static Component({
        data: { node, forceUpdate },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as AggregateRasterNode;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
            >
                <Select
                    {...nodeInputStyle}
                    value={thisNode.aggregation}
                    onChange={(e) => {
                        thisNode.aggregation = e.target.value as any;
                        forceUpdate();
                    }}
                >
                    {possibleAggregations.map((type, i) => (
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
