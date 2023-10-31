import { NodeProps } from "reactflow";
import {
    AbstractNode,
    NodeConstructorParams,
    NodeData,
} from "../../components/AbstractNode";
import { GenericNode } from "../../components/GenericNode";
import { Variable } from "../../components/Variable";
import { GraphState } from "../../graphState/graphState";
import { Node, VarType } from "../../types/serializationTypes";

type Attribute = {
    type: VarType;
    path: string;
};

export class GeoJsonLoaderNode extends AbstractNode {
    static title = "GeoJSON";
    static category = "Loaders";
    static type = "geoJsonLoader";

    private attributes: Attribute[] = [];

    public constructor(params: NodeConstructorParams) {
        super(
            {
                path: {
                    type: "string",
                    title: "Path",
                },
            },
            {
                geometry: {
                    type: "geometry",
                    title: "Geometry",
                },
            },
            params
        );
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);

        this.outputState.raster.nullable = false;
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as GeoJsonLoaderNode;

        if (node.nodeData.attributes)
            created.attributes = node.nodeData.attributes;

        return created;
    }

    public serializeNodeData(): Record<string, any> {
        return {
            attributes: this.attributes,
        };
    }

    public static Component({
        data: { node, forceUpdate },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as GeoJsonLoaderNode;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
            >
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
