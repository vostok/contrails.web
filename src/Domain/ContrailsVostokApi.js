// @flow
/* eslint-disable import/prefer-default-export */
import buildExamples from "../Domain/Responses/Examples";
import type { ExampleTraceInfosMap } from "../Domain/Responses/Examples";

import type { TraceInfo } from "./TraceInfo";
import type { IContrailsApi } from "./IContrailsApi";

export class ContrailsVostokApi implements IContrailsApi {
    urlPrefix: string;
    examples: ExampleTraceInfosMap;

    static additionalHeaders = {
        "Cache-Control": "no-cache, no-store",
        Pragma: "no-cache",
        Expires: "0",
        credentials: "same-origin",
    };

    constructor(urlPrefix: string) {
        this.urlPrefix = urlPrefix;
        this.examples = buildExamples("vostok");
    }

    async getTrace(id: string): Promise<TraceInfo> {
        if (Object.keys(this.examples).includes(id)) {
            return this.examples[id];
        }
        const response = await fetch(
            `${this.urlPrefix}/api/findTrace?traceId=${id}`,
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
