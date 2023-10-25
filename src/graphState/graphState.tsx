import { CreateToastFnReturn } from "@chakra-ui/react";
import { AbstractNode, NodeConstructor } from "../components/AbstractNode";
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

    public deserialize(data: Data, toast: CreateToastFnReturn): void {
        const nodeTypes = nodes.reduce(
            (prev, value) => ({
                ...prev,
                [(value as any).type]: value as any,
            }),
            {} as Record<string, NodeConstructor>
        );

        this.nodes = Object.entries(data.nodes)
            .map(([key, value]) => {
                const ctor = nodeTypes[value.type];

                if (!ctor) {
                    toast({
                        title: "Unknown node type",
                        description: `Unknown node type "${value.type}" detected, ignoring.`,
                        status: "error",
                        duration: 6000,
                        isClosable: true,
                    });
                    return null;
                }

                const def = new ctor({
                    id: key,
                    position: {
                        x: value.location[0],
                        y: value.location[1],
                    },
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
            })
            .filter((node) => node !== null) as Array<AbstractNode>;
    }
}
