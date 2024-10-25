import axios from "axios";
import { CoordsTranslator } from "../../minecraft/CoordsTranslator";
import { GeneratorData } from "../../types/generatorTypes";
import { Position } from "../../types/genericTypes";
import { insertMiddlePoints } from "../../utils/insertMidPoints";

export const estimateMinAltitude = async (
    data: GeneratorData,
    onChange: (data: GeneratorData) => void
) => {
    let points: Position[] = [
        [-data.mapSize.width / 2, -data.mapSize.height / 2],
        [data.mapSize.width / 2, -data.mapSize.height / 2],
        [data.mapSize.width / 2, data.mapSize.height / 2],
        [-data.mapSize.width / 2, data.mapSize.height / 2],
    ];

    points = insertMiddlePoints(points);
    points.push([0, 0]);

    const translator = new CoordsTranslator(
        data.mapCenter,
        [0, 0],
        0,
        data.scale.horizontal,
        data.scale.vertical,
        0
    );

    const latLons = points.map((point) =>
        translator.XZToLatLon(point[0], point[1])
    );

    console.log(
        latLons,
        data.mapCenter,
        data.scale.horizontal,
        data.scale.vertical
    );

    const response = await axios.get(
        `https://api.open-meteo.com/v1/elevation?latitude=${latLons
            .map((p) => p[0])
            .join(",")}&longitude=${latLons.map((p) => p[1]).join(",")}`
    );
    const alts = response.data.elevation;
    const minAlt = Math.min(...alts);
    data.minAltitude = minAlt - 20;
    onChange(data);
};
