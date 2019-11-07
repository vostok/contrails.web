import { DateTimeUtils } from "./DateTimeUtils";

export interface TimeMarker {
    title: string;
    value: number;
}

const intervals = [
    { value: 0.1 },
    { value: 0.2 },
    { value: 0.5 },
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
    { value: 30000 },
    { value: 60000 },
    { value: 120000 },
    { value: 300000 },
    { value: 600000 },
    { value: 1800000 },
    { value: 3600000 },
];

function getIntervalConfig(minIntervalMs: number): { value: number } {
    let result;
    for (const config of intervals) {
        if (config.value < minIntervalMs) {
            result = undefined;
        } else {
            result = config;
            break;
        }
    }
    return result || intervals[intervals.length - 1];
}

export function generateTimeMarkers(fromMs: number, toMs: number, minIntervalMs: number): TimeMarker[] {
    const intervalConfig = getIntervalConfig(minIntervalMs);
    const paceInterval = intervalConfig.value;
    const start = Math.ceil(fromMs / paceInterval) * paceInterval;
    const result = [];
    const zeroValue = DateTimeUtils.getDefaultTimeIntervalAsString(paceInterval);
    for (let value = start; value <= toMs; value += paceInterval) {
        result.push({
            title: DateTimeUtils.millisecondsToString(value, zeroValue),
            value: value,
        });
    }
    return result;
}
