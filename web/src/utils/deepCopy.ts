export function deepCopy<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
}
