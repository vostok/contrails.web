export interface VostokKnownAnnotations {
    host: string;
    application: string;
    kind: "http-request-client" | "http-request-server";
    "http.response.code"?: string;
    "http.request.size"?: string;
    "http.request.method"?: string;
    "http.response.size"?: string;
    "http.request.url"?: string;
    operation?: string;
}

export interface VostokSpanInfo {
    traceId: string;
    spanId: string;
    parentSpanId?: null | string;
    beginTimestamp: string;
    endTimestamp: string;
    annotations: VostokKnownAnnotations;
}
