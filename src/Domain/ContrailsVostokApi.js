// @flow
/* eslint-disable import/prefer-default-export */
import type { TraceInfo } from "./TraceInfo";
import type { IContrailsApi } from "./IContrailsApi";

export class ContrailsVostokApi implements IContrailsApi {
    urlPrefix: string;
    static additionalHeaders = {
        "Cache-Control": "no-cache, no-store",
        Pragma: "no-cache",
        Expires: "0",
        credentials: "same-origin",
    };

    constructor(urlPrefix: string) {
        this.urlPrefix = urlPrefix;
    }

    async getTrace(id: string): Promise<TraceInfo> {
        const response = await fetch(
            `${this.urlPrefix}/api/findTrace?traceId=${id}&out=vostok`,
            ContrailsVostokApi.additionalHeaders
        );
        if (response.status !== 200) {
            throw new Error("500");
        }
        const resp = await response.json();
        const result = {
            TraceId: resp.traceId,
            Spans: (resp.spans || []).map(span => {
                const { operationName, ...annotations } = span.annotations;
                return {
                    BeginTimestamp: span.beginTimestamp,
                    EndTimestamp: span.endTimestamp,
                    ParentSpanId: span.parentSpanId,
                    SpanId: span.spanId,
                    TraceId: span.traceId,
                    OperationName: operationName,
                    Annotations: annotations,
                };
            }),
        };
        return result;
    }
}
