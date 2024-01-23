import { Position } from "../types/genericTypes";

export const insertMiddlePoints = (points: Position[]) => {
    const newPoints: Position[] = [];
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const nextPoint = points[(i + 1) % points.length];
        newPoints.push(point);
        newPoints.push([
            (point[0] + nextPoint[0]) / 2,
            (point[1] + nextPoint[1]) / 2,
        ]);
    }
    return newPoints;
};
