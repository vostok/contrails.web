import { SpanInfo } from "./SpanInfo";
import { TraceInfo } from "./TraceInfo";
import { VostokSpanInfo } from "./VostokSpanInfo";

export function vostokResponseToTraceInfo(resp: VostokSpanInfo[]): TraceInfo {
    const result = {
        TraceId: resp[0].traceId,
        Spans: resp.map(
            (span: VostokSpanInfo): SpanInfo => {
                const { operation, ...annotations } = span.annotations;
                return {
                    BeginTimestamp: span.beginTimestamp,
                    EndTimestamp: span.endTimestamp,
                    ParentSpanId: span.parentSpanId,
                    SpanId: span.spanId,
                    TraceId: span.traceId,
                    OperationName: operation,
                    Annotations: { ...annotations },
                };
            }
        ),
    };
    return result;
}
