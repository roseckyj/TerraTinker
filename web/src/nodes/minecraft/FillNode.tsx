import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class FillNode extends AbstractNode {
    static title = "Fill";
    static category = "Minecraft";
    static type = "fill";
    static isAction = true;
    static helpPath = "/nodes/minecraft/fill";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                material: {
                    type: "material",
                    title: "Material",
                },
                minX: {
                    type: "float",
                    title: "Min X",
                },
                maxX: {
                    type: "float",
                    title: "Max X",
                },
                minY: {
                    type: "float",
                    title: "Min Y",
                },
                maxY: {
                    type: "float",
                    title: "Max Y",
                },
                minZ: {
                    type: "float",
                    title: "Min Z",
                },
                maxZ: {
                    type: "float",
                    title: "Max Z",
                },
                ignore: {
                    type: "boolean",
                    title: "Ignore",
                },
            },
            {},
            params
        );
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);
    }
}
