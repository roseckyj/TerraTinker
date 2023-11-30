import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";

export class SelectedRegionNode extends AbstractNode {
    static title = "Selected Region";
    static category = "Geometry";
    static type = "selectedRegion";

    public constructor(params: NodeConstructorParams) {
        super(
            {},
            {
                geometry: {
                    type: "geometry",
                    title: "Geometry",
                },
                minX: {
                    type: "float",
                    title: "Min X",
                },
                maxX: {
                    type: "float",
                    title: "Max X",
                },
                width: {
                    type: "float",
                    title: "Width (size X)",
                },
                minZ: {
                    type: "float",
                    title: "Min Z",
                },
                maxZ: {
                    type: "float",
                    title: "Max Z",
                },
                height: {
                    type: "float",
                    title: "Height (size Z)",
                },
                minAltitude: {
                    type: "float",
                    title: "Minimum Altitude",
                },
                horizontalScale: {
                    type: "float",
                    title: "Horizontal Scale",
                },
                verticalScale: {
                    type: "float",
                    title: "Vertical Scale",
                },
            },
            params
        );
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);

        Object.keys(this.outputState).forEach((key) => {
            this.outputState[key].nullable = false;
        });
    }
}
