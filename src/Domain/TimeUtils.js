// @flow
export function getDefaultTimeIntervalAsString(totalMilliSeconds: number): string {
    const numSeconds = Math.floor(totalMilliSeconds / 1000);
    if (numSeconds > 0) {
        return "0s";
    }
    return "0ms";
}

export function millisecondsToString(totalMilliSeconds: number, zeroValue: string): string {
    // TODO добавить минуты, часы, дни, недели, месяцы, года(?)
    const numMinutes = Math.floor(totalMilliSeconds / 1000 / 60);
    const numSeconds = Math.floor(totalMilliSeconds / 1000 % 60);
    const milliSeconds = Math.round(totalMilliSeconds % 1000 * 10) / 10;
    let result = "";
    if (numMinutes !== 0) {
        result += result === "" ? "" : " ";
        result += `${numMinutes} min`;
    }
    if (numSeconds !== 0) {
        result += result === "" ? "" : " ";
        result += `${numSeconds}s`;
    }
    if (milliSeconds !== 0) {
        result += result === "" ? "" : " ";
        result += `${milliSeconds}ms`;
    }
    if (result === "") {
        return zeroValue;
    }
    return result;
}
