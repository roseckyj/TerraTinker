import { NodeProps } from "reactflow";
import { GraphState } from "../graphState/graphState";
import { Input, Node, VarType } from "../types/serializationTypes";
import { GenericNode } from "./GenericNode";
import { Variable } from "./Variable";
import { varTypes } from "./_varTypes";

export type NodeData = {
    node: AbstractNode;
    forceUpdate: () => void;
    updateConnections: () => void;
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

export type NodeConstructorParams = {
    id: string;
    position: { x: number; y: number };
};

export type NodeConstructor = new (
    params: NodeConstructorParams
) => AbstractNode;

export abstract class AbstractNode {
    static title: string;
    static category: string;
    static type: string;

    id: string;
    position: { x: number; y: number };
    version: number = 0;

    inputs: HandlesDefinition = {};
    outputs: HandlesDefinition = {};

    inputState: Record<string, InputState> = {};
    outputState: Record<string, OutputState> = {};

    constructor(
        inputs: HandlesDefinition,
        outputs: HandlesDefinition,
        { id, position }: NodeConstructorParams
    ) {
        this.inputs = inputs;
        this.outputs = outputs;

        this.inputState = Object.keys(this.inputs).reduce(
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
        this.outputState = Object.keys(this.outputs).reduce(
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

                const type = this.inputs[key].type;
                const parentType = parentNode.outputs[input.handleId!].type;

                if (type !== parentType) {
                    this.inputState[key] = {
                        value: varTypes[type].default,
                        nodeId: null,
                        handleId: null,
                        nullable: false,
                    };
                } else {
                    this.inputState[key] = {
                        value: this.inputState[key].value,
                        nodeId: parentNode.id,
                        handleId: input.handleId!,
                        nullable,
                    };
                }
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
                              type: this.inputs[key].type,
                              value: value.value,
                          },
                }),
                {}
            ),
            nodeData: this.serializeNodeData(),
        };
    }

    public static deserialize(id: string, node: Node) {
        const ctor = this as any as NodeConstructor;

        const def = new ctor({
            id,
            position: {
                x: node.location[0],
                y: node.location[1],
            },
        });
        def.inputState = Object.keys(def.inputs).reduce((prev, key) => {
            const inputValue: Input | null = node.inputs[key];

            return {
                ...prev,
                [key]:
                    inputValue && inputValue.kind === "link"
                        ? {
                              value: null,
                              nodeId: (inputValue as any).node,
                              handleId: (inputValue as any).output,
                              nullable: false,
                          }
                        : {
                              value: inputValue
                                  ? (inputValue as any).value
                                  : varTypes[def.inputs[key].type].default,
                              nodeId: null,
                              handleId: null,
                              nullable: false,
                          },
            };
        }, {});
        return def;
    }

    public static Component({
        data: { node, forceUpdate },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;

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
