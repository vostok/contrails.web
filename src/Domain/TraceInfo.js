// @flow
import type { SpanInfo } from "./SpanInfo";

export type TraceInfo = {
    Spans: Array<SpanInfo>,
    TraceId: string,
};
