import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class ReplaceNode extends AbstractNode {
    static title = "Replace";
    static category = "Minecraft";
    static type = "replace";
    static isAction = true;

    public constructor(params: NodeConstructorParams) {
        super(
            {
                source: {
                    type: "material",
                    title: "Replace",
                },
                target: {
                    type: "material",
                    title: "With",
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
