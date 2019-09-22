export function strictDefined<T>(value: undefined | T): T {
    if (value == undefined) {
        throw new Error("Value should be defined");
    }
    return value;
}
