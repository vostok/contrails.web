// @flow
import moment from "moment";

import type { TraceInfo } from "../../src/Domain/TraceInfo";
import type { SpanInfo } from "../../src/Domain/SpanInfo";
import { arrangeSpanInfos } from "../../src/Domain/SpanInfoEnricher";

function min(x: number, y: number): number {
    return Math.min(x, y);
}

function max(x: number, y: number): number {
    return Math.max(x, y);
}

export function buildDataFromSpans(spans: SpanInfo[]): * {
    return {
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
        data: { lines: arrangeSpanInfos(spans) },
    };
}

export function buildPropsFromResponse(response: TraceInfo[]): * {
    const spans = response[0].Spans;
    return {
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
        data: { lines: arrangeSpanInfos(spans) },
    };
}
