import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class SetBlockNode extends AbstractNode {
    static title = "Set Block";
    static category = "Minecraft";
    static type = "setBlock";
    static isAction = true;

    public constructor(params: NodeConstructorParams) {
        super(
            {
                material: {
                    type: "material",
                    title: "Material",
                },
                x: {
                    type: "float",
                    title: "X",
                },
                y: {
                    type: "float",
                    title: "Y",
                },
                z: {
                    type: "float",
                    title: "Z",
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
