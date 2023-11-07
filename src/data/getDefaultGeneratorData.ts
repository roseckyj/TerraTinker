import { v4 as uuidv4 } from "uuid";
import { GeneratorData } from "../types/generatorTypes";
import { Layer } from "../types/layerTypes";
import defaultLayer from "./layers/default.json";

export function getDefaultGeneratorData(): GeneratorData {
    return {
        mapCenter: [49.1952669, 16.6073183],
        scale: {
            horizontal: 1,
            vertical: 1,
        },
        mapSize: {
            width: 1000,
            height: 1000,
        },
        layers: [getDefaultLayer()],
    };
}

export function getDefaultLayer(): Layer {
    const layer = defaultLayer as any as Layer;
    layer.id = uuidv4();
    return layer;
}
