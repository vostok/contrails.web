// @flow
import moment from "moment";

import type { SpanInfo } from "./SpanInfo";

export type SpanNode = {
    type: "SingleSpan",
    from: number,
    to: number,
    serviceName: string,
    spanTitle: string,
    colorConfig: number,
    source: SpanInfo,
    children: Array<SpanNode>,
};

export type TraceTree = SpanNode;

export function buildTraceTree(spans: Array<SpanInfo>): TraceTree {
    const root = spans.find(x => x.ParentSpanId == null);
    return spanInfoToSpanNode(root, spans);
}

function spanInfoToSpanNode(span: SpanInfo, spans: Array<SpanInfo>): SpanNode {
    return {
        type: "SingleSpan",
        from: moment(span.BeginTimestamp).valueOf(),
        to: moment(span.EndTimestamp).valueOf(),
        serviceName: (span.Annotations && span.Annotations.OriginId) || "Unknown Service",
        spanTitle: "",
        colorConfig: 0,
        source: span,
        children: spans
            .filter(x => x !== span)
            .filter(x => x.ParentSpanId != null)
            .filter(x => x.ParentSpanId === span.SpanId)
            .map(x => spanInfoToSpanNode(x, spans)),
    };
}
