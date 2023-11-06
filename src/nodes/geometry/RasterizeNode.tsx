import {
    AbstractNode,
    NodeConstructorParams,
} from "../../components/AbstractNode";

export class RasterizeNode extends AbstractNode {
    static title = "Rasterize";
    static category = "Geometry";
    static type = "rasterize";
    static isFork = true;

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
