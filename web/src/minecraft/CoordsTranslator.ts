// lat = NS = x = phi
// lon = WE = z = lambda

const EARTH_RADIUS = 6371 * 1000;

export class CoordsTranslator {
    private altShift = 0;
    public readonly mapCenter: [number, number];
    public readonly ingameCenter: [number, number];
    public readonly rotation: number;
    public readonly xzScale: number;
    public readonly yScale: number;

    private minWorldY = 0;

    constructor(
        coordCenter: [number, number],
        ingameCenter: [number, number],
        rotation: number,
        xzScale: number,
        yScale: number,
        minWorldY: number
    ) {
        this.mapCenter = [this.rad(coordCenter[0]), this.rad(coordCenter[1])];
        this.ingameCenter = [ingameCenter[0], ingameCenter[1]];
        this.rotation = rotation;
        this.xzScale = xzScale;
        this.yScale = yScale;
        this.minWorldY = minWorldY;
    }

    public setAltShift(altShift: number): void {
        this.altShift = altShift;
    }

    // the highest point in brno is around 479 m, the lowest around 180 m
    public altToY(alt: number): number {
        return this.heightToY(alt + this.altShift) + this.minWorldY;
    }

    public yToAlt(y: number): number {
        return this.yToHeight(y - this.minWorldY) - this.altShift;
    }

    public heightToY(height: number): number {
        return Math.round(height * this.yScale);
    }

    public yToHeight(y: number): number {
        return y / this.yScale;
    }

    // Using Orthographic projection https://en.wikipedia.org/wiki/Orthographic_map_projection
    public latLonToXZ(lat: number, lon: number): [number, number] {
        lat = this.rad(lat);
        lon = this.rad(lon);

        const deltaLon = lon - this.mapCenter[1];
        let x = EARTH_RADIUS * Math.cos(lat) * Math.sin(deltaLon);
        let z =
            EARTH_RADIUS *
            (Math.cos(this.mapCenter[0]) * Math.sin(lat) -
                Math.sin(this.mapCenter[0]) *
                    Math.cos(lat) *
                    Math.cos(deltaLon));

        const x2 = x * Math.cos(this.rotation) - z * Math.sin(this.rotation);
        const z2 = x * Math.sin(this.rotation) + z * Math.cos(this.rotation);

        x = x2;
        z = z2;

        x *= this.xzScale;
        z *= -this.xzScale;

        return [x + this.ingameCenter[0], z + this.ingameCenter[1]];
    }

    public latLonToXZPoint(point: [number, number]): [number, number] {
        return this.latLonToXZ(point[0], point[1]);
    }

    public latLonToXZVector(
        point: [number, number, number]
    ): [number, number, number] {
        return [...this.latLonToXZ(point[0], point[1]), this.altToY(point[2])];
    }

    public XZToLatLon(x: number, z: number): [number, number] {
        x -= this.ingameCenter[0];
        z -= this.ingameCenter[1];

        x /= this.xzScale;
        z /= -this.xzScale;

        let x2 = x * Math.cos(-this.rotation) - z * Math.sin(-this.rotation);
        let z2 = x * Math.sin(-this.rotation) + z * Math.cos(-this.rotation);

        x = x2;
        z = z2;

        const rho = Math.sqrt(x * x + z * z);
        const c = Math.asin(rho / EARTH_RADIUS);
        const cosC = Math.cos(c);
        const sinC = Math.sin(c);
        const cosPhi0 = Math.cos(this.mapCenter[0]);
        const sinPhi0 = Math.sin(this.mapCenter[0]);

        let lat =
            rho === 0
                ? this.mapCenter[0]
                : Math.asin(cosC * sinPhi0 + (z * sinC * cosPhi0) / rho);
        let lon =
            this.mapCenter[1] +
            Math.atan2(x * sinC, rho * cosC * cosPhi0 - z * sinC * sinPhi0);

        return [this.deg(lat), this.deg(lon)];
    }

    public XZToLatLonPoint(point: [number, number]): [number, number] {
        return this.XZToLatLon(point[0], point[1]);
    }

    public XZToLatLonVector(
        point: [number, number, number]
    ): [number, number, number] {
        return [...this.XZToLatLon(point[0], point[1]), this.yToAlt(point[2])];
    }

    public PointToGeom(point: [number, number]): string {
        return `ST_GeomFromText('POINT(${point[1]} ${point[0]})')`;
    }

    public CornersToGeom(from: [number, number], to: [number, number]): string {
        const fx = Math.min(from[0], to[0]);
        const fy = Math.min(from[1], to[1]);
        const tx = Math.max(from[0], to[0]);
        const ty = Math.max(from[1], to[1]);

        return `${fx.toFixed(10)},${fy.toFixed(10)},${tx.toFixed(
            10
        )},${ty.toFixed(10)}`;
    }

    private rad(deg: number): number {
        return (deg / 180) * Math.PI;
    }

    private deg(rad: number): number {
        return (rad / Math.PI) * 180;
    }
}
