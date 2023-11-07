import { CreateToastFnReturn } from "@chakra-ui/react";
import {
    AbstractNode,
    NodeConstructor,
} from "../components/nodeGraph/AbstractNode";
import { nodes } from "../nodes/_nodes";
import { Position } from "../types/genericTypes";
import { Layer } from "../types/layerTypes";

export class GraphState {
    public nodes: Array<AbstractNode> = [];
    public flowStartLocation: Position = [0, 0];

    public serialize(): Layer {
        return {
            config: {
                join: "cartesian", // TBAL
            },
            flow: {
                nodes: this.nodes
                    .filter((node) => node.flowOrder !== null)
                    .sort((a, b) => a.flowOrder! - b.flowOrder!)
                    .map((node) => node.id),
                startLocation: this.flowStartLocation,
            },
            nodes: this.nodes.reduce(
                (prev, node) => ({ ...prev, [node.id]: node.serialize() }),
                {}
            ),
        };
    }

    public deserialize(data: Layer, toast: CreateToastFnReturn): void {
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

                const node = ctor.deserialize(key, value);
                const flowOrder = (
                    data.flow || {
                        nodes: [],
                        startLocation: [0, 0],
                    }
                ).nodes.indexOf(key);

                node.flowOrder = flowOrder === -1 ? null : flowOrder;
                return node;
            })
            .filter((node) => node !== null) as Array<AbstractNode>;

        this.flowStartLocation = (
            data.flow || {
                nodes: [],
                startLocation: [0, 0],
            }
        ).startLocation;
    }
}
