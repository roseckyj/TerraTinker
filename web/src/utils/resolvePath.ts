export function resolvePath(
    path: string,
    base: string | null | undefined = null,
    popLastSegment: boolean = false
) {
    if (base === null || base === undefined) {
        base = "";
    }

    if (path.startsWith("/")) {
        base = "";
    }

    const segments = path.split("/").filter((segment) => segment.length > 0);
    const baseSegments = base
        .split("/")
        .filter((segment) => segment.length > 0);

    if (popLastSegment) {
        baseSegments.pop();
    }

    const resolvedSegments = baseSegments;

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        if (segment === "..") {
            resolvedSegments.pop();
        } else if (segment === ".") {
            continue;
        } else {
            resolvedSegments.push(segment);
        }
    }
    return resolvedSegments.join("/");
}
