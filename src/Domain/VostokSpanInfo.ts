export interface VostokKnownAnnotations {
    host?: string;
    "host.name"?: string;

    application?: string;
    "service.name"?: string;

    kind?: string;

    "http.response.code"?: string;
    "http.status_code"?: string;

    operation?: string;
    name?: string;
}

export interface VostokSpanInfo {
    traceId: string;
    spanId: string;
    parentSpanId?: null | string;
    beginTimestamp: string;
    endTimestamp: string;
    annotations: VostokKnownAnnotations;
}
