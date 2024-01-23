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
import { Node } from "../../types/layerTypes";
import { capitalize } from "../../utils/capitalize";
import { nodeInputStyle } from "../../utils/styles";

const possibleInterpolations = ["nearest", "bilinear"];

export class AggregateRasterNode extends AbstractNode {
    static title = "Aggregate Raster";
    static category = "Raster";
    static type = "aggregateRaster";

    private interpolation: string = "bilinear";

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
                min: {
                    type: "float",
                    title: "Minimum value",
                },
                max: {
                    type: "float",
                    title: "Maximum value",
                },
                average: {
                    type: "float",
                    title: "Average value",
                },
                minY: {
                    type: "float",
                    title: "Minimum Y",
                },
                maxY: {
                    type: "float",
                    title: "Maximum Y",
                },
                averageY: {
                    type: "float",
                    title: "Average Y",
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

        Object.values(this.outputState).forEach((state) => {
            state.nullable = inputNullable;
        });
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as AggregateRasterNode;

        if (node.nodeData.interpolation) {
            created.interpolation = node.nodeData.interpolation;
        }

        return created;
    }

    public serializeNodeData(): Record<string, any> {
        return {
            interpolation: this.interpolation,
        };
    }

    public static Component({
        data: { node, forceUpdate, locked },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as AggregateRasterNode;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
                locked={locked}
            >
                <Select
                    {...nodeInputStyle}
                    value={thisNode.interpolation}
                    onChange={(e) => {
                        thisNode.interpolation = e.target.value as any;
                        forceUpdate();
                    }}
                >
                    {possibleInterpolations.map((type, i) => (
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
