import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class LogNode extends AbstractNode {
    static title = "Log";
    static category = "Misc";
    static type = "log";
    static isAction = true;

    public constructor(params: NodeConstructorParams) {
        super(
            {
                title: {
                    type: "string",
                    title: "Title",
                },
                a: {
                    type: "float",
                    title: "A",
                },
                b: {
                    type: "float",
                    title: "B",
                },
                c: {
                    type: "float",
                    title: "C",
                },
                d: {
                    type: "float",
                    title: "D",
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
