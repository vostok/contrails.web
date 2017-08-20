// @flow

export type SpanInfo = {
    TraceId: string,
    SpanId: string,
    ParentSpanId: ?string,
    OperationName: string,
    BeginTimestamp: string,
    EndTimestamp: string,
    Annotations: ?{ [key: string]: string },
};
