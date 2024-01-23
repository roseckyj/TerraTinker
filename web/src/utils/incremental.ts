export function incremental(elements: number, from: number = 0): number[] {
    return Array.from(Array(elements), (_, index) => index + from);
}
