import { NodeProps } from "reactflow";
import { GenericNode } from "../components/GenericNode";
import { Variable } from "../components/Variable";
import { GraphState } from "../graphState/graphState";
import { Node, VarType } from "../types/serializationTypes";

export type NodeData = {
    node: AbstractNode;
    forceUpdate: () => void;
    version: any;
};

export type HandleDefinition = {
    type: VarType;
    title: string;
};

export type InputState = {
    value: any | null;
    nodeId: string | null;
    handleId: string | null;
    nullable: boolean;
};

export type OutputState = {
    nullable: boolean;
};

export type HandlesDefinition = Record<string, HandleDefinition>;

export abstract class AbstractNode {
    static title: string;
    static category: string;
    static type: string;

    id: string;
    position: { x: number; y: number };
    version: number = 0;

    static inputs: HandlesDefinition = {};
    static outputs: HandlesDefinition = {};

    inputState: Record<string, InputState> = {};
    outputState: Record<string, OutputState> = {};

    constructor(id: string, position: { x: number; y: number }) {
        const ctor = this.constructor as typeof AbstractNode;
        this.inputState = Object.keys(ctor.inputs).reduce(
            (acc, key) => ({
                ...acc,
                [key]: {
                    value: null,
                    nodeId: null,
                    handleId: null,
                    nullable: false,
                },
            }),
            {}
        );
        this.outputState = Object.keys(ctor.outputs).reduce(
            (acc, key) => ({
                ...acc,
                [key]: {
                    nullable: false,
                },
            }),
            {}
        );
        this.id = id;
        this.position = position;
    }

    public updateConnections(graphState: GraphState) {
        Object.entries(this.inputState)
            .filter(([, input]) => input.nodeId)
            .forEach(([key, input]) => {
                const parentNode = graphState.nodes.find(
                    (node) => node.id === input.nodeId
                )!;

                const nullable =
                    parentNode.outputState[input.handleId!].nullable;

                this.inputState[key] = {
                    value: this.inputState[key].value,
                    nodeId: parentNode.id,
                    handleId: input.handleId!,
                    nullable,
                };
            });

        // Outputs are handled in specific nodes
    }

    public serializeNodeData(): Record<string, any> {
        return {};
    }
    public serialize(): Node {
        return {
            type: (this.constructor as typeof AbstractNode).type,
            location: [this.position.x, this.position.y],
            inputs: Object.entries(this.inputState).reduce(
                (prev, [key, value]) => ({
                    ...prev,
                    [key]: value.nodeId
                        ? {
                              kind: "link",
                              node: value.nodeId,
                              output: value.handleId,
                          }
                        : {
                              kind: "value",
                              type: (this.constructor as typeof AbstractNode)
                                  .inputs[key].type,
                              value: value.value,
                          },
                }),
                {}
            ),
            nodeData: this.serializeNodeData(),
        };
    }

    public static Component({
        data: { node, forceUpdate },
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        return (
            <GenericNode title={ctor.title} category={ctor.category}>
                {Object.entries(ctor.inputs).map(([id, input]) => (
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
                {Object.entries(ctor.outputs).map(([id, output]) => (
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
