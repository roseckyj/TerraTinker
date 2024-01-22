import { Input } from "@chakra-ui/react";
import { NodeProps } from "reactflow";
import {
    AbstractNode,
    NodeConstructorParams,
    NodeData,
} from "../../components/nodeGraph/AbstractNode";
import { GenericNode } from "../../components/nodeGraph/GenericNode";
import { Variable } from "../../components/nodeGraph/Variable";
import { GraphState } from "../../graphState/graphState";
import { nodeInputStyle } from "../../utils/styles";

export class LocalFileNode extends AbstractNode {
    static title = "Local File";
    static category = "Loaders";
    static type = "localFile";

    public constructor(params: NodeConstructorParams) {
        super(
            {},
            {
                path: {
                    type: "string",
                    title: "Path",
                },
            },
            params
        );
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);

        this.outputState.path.nullable = false;
    }

    public static Component({
        data: { node, forceUpdate, locked },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof LocalFileNode;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
                locked={locked}
            >
                <Input {...nodeInputStyle} type="file"></Input>
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
