// @flow
import moment from "moment";

import type { SpanInfo } from "./SpanInfo";
import type { TimeRange } from "./TimeRange";

export type TraceInfo = {
    Spans: Array<SpanInfo>,
    TraceId: string,
};

// eslint-disable-next-line import/prefer-default-export
export class TraceInfoUtils {
    static getTraceTimeRange(traceInfo: TraceInfo): TimeRange {
        const spans = traceInfo.Spans;
        const result = {
            from: spans
                .map(x => x.BeginTimestamp)
                .map(x => moment(x))
                .map(x => x.valueOf())
                .reduce(min),
            to: spans
                .map(x => x.EndTimestamp)
                .map(x => moment(x))
                .map(x => x.valueOf())
                .reduce(max),
        };
        return result;
    }
}

function min(x: number, y: number): number {
    return Math.min(x, y);
}

function max(x: number, y: number): number {
    return Math.max(x, y);
}
