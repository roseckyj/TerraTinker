import { AbstractNode } from "../nodes/_AbstractNode";
import { nodes } from "../nodes/_nodes";
import { Data } from "../types/serializationTypes";

export class GraphState {
    public nodes: Array<AbstractNode> = [];

    public serialize(): Data {
        return {
            config: {
                join: "cartesian", // TBAL
            },
            nodes: this.nodes.reduce(
                (prev, node) => ({ ...prev, [node.id]: node.serialize() }),
                {}
            ),
        };
    }

    public deserialize(data: Data): void {
        const nodeTypes = nodes.reduce(
            (prev, value) => ({
                ...prev,
                [(value as any).type]: value as any,
            }),
            {} as Record<
                string,
                new (
                    id: string,
                    position: { x: number; y: number }
                ) => AbstractNode
            >
        );

        this.nodes = Object.entries(data.nodes).map(([key, value]) => {
            const def = new nodeTypes[value.type](key, {
                x: value.location[0],
                y: value.location[1],
            });
            def.inputState = Object.entries(value.inputs).reduce(
                (prev, [key, value]) => ({
                    ...prev,
                    [key]:
                        value.kind === "link"
                            ? {
                                  value: null,
                                  nodeId: (value as any).node,
                                  handleId: (value as any).output,
                                  nullable: false,
                              }
                            : {
                                  value: (value as any).value,
                                  nodeId: null,
                                  handleId: null,
                                  nullable: false,
                              },
                }),
                {}
            );
            return def;
        });
    }
}
