import { Position } from "./genericTypes";
import { Layer } from "./layerTypes";

export type GeneratorData = {
    mapCenter: Position;
    scale: {
        horizontal: number;
        vertical: number;
    };
    mapSize: {
        width: number;
        height: number;
    };
    layers: Array<Layer>;
};
