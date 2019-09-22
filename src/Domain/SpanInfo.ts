export interface SpanAnnotations {
    [key: string]: undefined | string | boolean | number;
}

export interface SpanInfo {
    TraceId: string;
    SpanId: string;
    ParentSpanId?: undefined | null | string;
    OperationName?: string;
    BeginTimestamp: string;
    EndTimestamp: string;
    Annotations?: null | SpanAnnotations;
}
