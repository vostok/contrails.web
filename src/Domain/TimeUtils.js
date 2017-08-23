// @flow

export function getDefaultTimeIntervalAsString(totalMilliSeconds: number): string {
    const numSeconds = Math.floor(totalMilliSeconds / 1000);
    if (numSeconds > 0) {
        return "0s";
    }
    return "0ms";
}

export function millisecondsToString(totalMilliSeconds: number, zeroValue: string): string {
    // var numyears = Math.floor(seconds / 31536000);
    // var numdays = Math.floor((seconds % 31536000) / 86400);
    // var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    // var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    // var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    // return numyears + " years " +  numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
    const numSeconds = Math.floor(totalMilliSeconds / 1000);
    const milliSeconds = totalMilliSeconds % 1000;
    let result = "";
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
