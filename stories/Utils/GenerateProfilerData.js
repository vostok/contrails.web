// @flow
import _ from "lodash";

function random(min: number, max: number, action?: number => void): number {
    const result = Math.random() * (max - min) + min;
    if (action != null) {
        action(result);
    }
    return result;
}

type ProfilerItem = {
    from: number,
    to: number,
};

type ProfilerLine = {
    items: Array<ProfilerItem>,
};

// eslint-disable-next-line max-params
export default function generateProfilerData(
    from: number,
    to: number,
    level: number,
    deep: number,
    prevResult?: Array<ProfilerLine>
): Array<ProfilerLine> {
    const count = 4;
    let result = prevResult || [];
    result[level] = result[level] || { items: [] };

    const newBars = _.range(0, count).map(index => ({
        from: Math.round(from + (to - from) / count * index + (to - from) * random(0.001, 0.05)),
        to: Math.round(from + (to - from) / count * (index + 1) - (to - from) * random(0.001, 0.05)),
    }));

    result[level].items = [...result[level].items, ...newBars];

    if (level < deep) {
        for (const bar of newBars) {
            result = generateProfilerData(bar.from, bar.to, level + 1, deep, result);
        }
    }
    return result;
}
