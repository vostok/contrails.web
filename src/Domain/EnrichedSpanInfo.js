// @flow
export type EnrichedSpanInfo = {
    TraceId: string,
    SpanId: string,
    ParentSpanId?: ?string,
    OperationName: string,
    BeginTimestamp: string,
    EndTimestamp: string,
    Annotations: ?{ [key: string]: mixed },

    // serviceName: string,
    // serviceTitle: string,
    from: number,
    to: number,
    colorConfig: number,
    parent: ?EnrichedSpanInfo,
    children: Array<EnrichedSpanInfo>,
    //
};
