import moment from "moment";

import { SpanInfo } from "./SpanInfo";
import { TimeRange } from "./TimeRange";

export interface TraceInfo {
    Spans: SpanInfo[];
    TraceId: string;
}

export class TraceInfoUtils {
    public static getTraceTimeRange(spans: SpanInfo[]): TimeRange {
        const result = {
            from: spans
                .map(x => x.BeginTimestamp)
                .map(x => moment(x, undefined))
                .map(x => x.valueOf())
                .reduce(min),
            to: spans
                .map(x => x.EndTimestamp)
                .map(x => moment(x, undefined))
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
