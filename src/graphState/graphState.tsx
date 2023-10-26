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
                const ctor = nodeTypes[
                    value.type
                ] as any as typeof AbstractNode;

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

                return ctor.deserialize(key, value);
            })
            .filter((node) => node !== null) as Array<AbstractNode>;
    }
}
