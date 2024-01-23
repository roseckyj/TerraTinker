import { CreateToastFnReturn } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import {
    AbstractNode,
    NodeConstructor,
} from "../components/nodeGraph/AbstractNode";
import { nodes } from "../nodes/_nodes";
import { Position } from "../types/genericTypes";
import { Layer, Node } from "../types/layerTypes";

export class GraphState {
    public layerName: string = "New layer";
    public id: string = uuidv4();
    public nodes: Array<AbstractNode> = [];
    public flowStartLocation: Position = [0, 0];

    public serialize(): Layer {
        return {
            name: this.layerName,
            id: this.id,
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
        this.nodes = Object.entries(data.nodes)
            .map(([key, value]) => {
                const node = GraphState.deserializeNode(value, key);

                if (!node) {
                    toast({
                        title: "Unknown node type",
                        description: `Unknown node type "${value.type}" detected, ignoring.`,
                        status: "warning",
                    });
                    return null;
                }

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

        this.layerName = data.name;
        this.id = data.id;
    }

    public static deserializeNode(
        node: Node,
        key: string
    ): AbstractNode | null {
        const nodeTypes = nodes.reduce(
            (prev, value) => ({
                ...prev,
                [(value as any).type]: value as any,
            }),
            {} as Record<string, NodeConstructor>
        );

        const ctor = nodeTypes[node.type] as any as typeof AbstractNode;

        if (!ctor) {
            return null;
        }

        return ctor.deserialize(key, node);
    }
}
