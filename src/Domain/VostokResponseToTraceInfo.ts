import { SpanInfo } from "./SpanInfo";
import { TraceInfo } from "./TraceInfo";
import { VostokSpanInfo } from "./VostokSpanInfo";

export function vostokResponseToTraceInfo(resp: VostokSpanInfo[]): TraceInfo {
    const result = {
        TraceId: resp[0].traceId,
        Spans: resp.map(
            (span: VostokSpanInfo): SpanInfo => {
                const { operation } = span.annotations;
                return {
                    BeginTimestamp: span.beginTimestamp,
                    EndTimestamp: span.endTimestamp,
                    ParentSpanId: span.parentSpanId?.replace(/-/g,""),
                    SpanId: span.spanId.replace(/-/g,""),
                    TraceId: span.traceId.replace(/-/g,""),
                    OperationName: operation,
                    Annotations: { ...span.annotations },
                };
            }
        ),
    };
    return result;
}
