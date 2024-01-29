import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class WorldInfoNode extends AbstractNode {
    static title = "World Info";
    static category = "Minecraft";
    static type = "worldInfo";
    static helpPath = "/nodes/minecraft/worldInfo";

    public constructor(params: NodeConstructorParams) {
        super(
            {},
            {
                minY: {
                    type: "float",
                    title: "Min Y",
                },
                maxY: {
                    type: "float",
                    title: "Max Y",
                },
            },
            params
        );
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);

        this.outputState.minY.nullable = false;
        this.outputState.maxY.nullable = false;
    }
}
