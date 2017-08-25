// @flow
import { getDefaultTimeIntervalAsString, millisecondsToString } from "./TimeUtils";

export type TimeMarker = {
    title: string,
    value: number,
};

const intervals = [
    { value: 1 },
    { value: 2 },
    { value: 5 },
    { value: 10 },
    { value: 20 },
    { value: 50 },
    { value: 100 },
    { value: 150 },
    { value: 500 },
    { value: 750 },
    { value: 1000 },
    { value: 2000 },
    { value: 5000 },
    { value: 10000 },
];

function getIntervalConfig(minIntervalMs: number): { value: number } {
    let result = null;
    for (const config of intervals) {
        if (config.value < minIntervalMs) {
            result = null;
        } else {
            result = config;
            break;
        }
    }
    return result || intervals[intervals.length - 1];
}

export default function generateTimeMarkers(fromMs: number, toMs: number, minIntervalMs: number): TimeMarker[] {
    const intervalConfig = getIntervalConfig(minIntervalMs);
    const paceInterval = intervalConfig.value;
    const start = Math.ceil(fromMs / paceInterval) * paceInterval;
    const result = [];
    const zeroValue = getDefaultTimeIntervalAsString(paceInterval);
    for (let value = start; value <= toMs; value += paceInterval) {
        result.push({
            title: millisecondsToString(value, zeroValue),
            value: value,
        });
    }
    return result;
}
