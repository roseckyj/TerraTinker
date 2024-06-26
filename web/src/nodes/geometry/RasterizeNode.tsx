import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/nodeGraph/AbstractNode";

export class RasterizeNode extends AbstractNode {
    static title = "Rasterize";
    static category = "Geometry";
    static type = "rasterize";
    static isFork = true;
    static helpPath = "/nodes/geometry/rasterize";

    public constructor(params: NodeConstructorParams) {
        super(
            {
                geometry: {
                    type: "geometry",
                    title: "Geometry",
                },
                fill: {
                    type: "boolean",
                    title: "Fill",
                },
                strokeWeight: {
                    type: "float",
                    title: "Stroke Weight",
                },
                pointSize: {
                    type: "float",
                    title: "Point Size",
                },
                clip: {
                    type: "boolean",
                    title: "Clip to region",
                },
                ignore: {
                    type: "boolean",
                    title: "Ignore",
                },
            },
            {
                x: {
                    type: "float",
                    title: "X",
                },
                z: {
                    type: "float",
                    title: "Z",
                },
            },
            params
        );
    }
}
