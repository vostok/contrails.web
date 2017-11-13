// @flow
/* eslint-disable import/prefer-default-export */
import moment from "moment";
import _ from "lodash";

import type { TraceInfo } from "./TraceInfo";
import type { SpanInfo } from "./SpanInfo";
import type { IContrailsApi } from "./IContrailsApi";

function booleanXOR(left: boolean, right: boolean): boolean {
    return left ? !right : right;
}

export function fixLogsearchClientServerSpan(spans: Array<SpanInfo>): Array<SpanInfo> {
    const spansById = _.groupBy(spans, x => x.SpanId);
    for (const spanId of Object.keys(spansById)) {
        if (
            spansById[spanId].length === 2 &&
            spansById[spanId][0].Annotations &&
            typeof spansById[spanId][0].Annotations.IsClientSpan === "boolean" &&
            typeof spansById[spanId][1].Annotations.IsClientSpan === "boolean"
        ) {
            if (
                booleanXOR(spansById[spanId][0].Annotations.IsClientSpan, spansById[spanId][1].Annotations.IsClientSpan)
            ) {
                const clientSpan = spansById[spanId].find(x => x.Annotations.IsClientSpan);
                const serverSpan = spansById[spanId].find(x => !x.Annotations.IsClientSpan);
                clientSpan.SpanId += "1";
                serverSpan.ParentSpanId = clientSpan.SpanId;
            }
        }
    }
    return spans;
}

export class ContrailsLogsearchApi implements IContrailsApi {
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
            ContrailsLogsearchApi.additionalHeaders
        );
        if (response.status !== 200) {
            throw new Error("500");
        }
        const resp = await response.json();
        if (resp.length === 0) {
            throw new Error("404");
        }
        resp[0].Spans = fixLogsearchClientServerSpan(resp[0].Spans);
        const firstItem = resp[0].Spans[0];
        for (const item of resp[0].Spans) {
            const diffMs = moment(firstItem.BeginTimestamp).valueOf() - moment(item.BeginTimestamp).valueOf();
            if (Math.abs(diffMs) > 1000 * 60 * 60 * 2 - 1000 * 600) {
                item.BeginTimestamp = moment(
                    moment(item.BeginTimestamp).valueOf() + Math.sign(diffMs) * 1000 * 60 * 60 * 2
                ).format("YYYY-MM-DDTHH:mm:ss.SSSSSSSZ");
                item.EndTimestamp = moment(
                    moment(item.EndTimestamp).valueOf() + Math.sign(diffMs) * 1000 * 60 * 60 * 2
                ).format("YYYY-MM-DDTHH:mm:ss.SSSSSZ");
                item.Annotations = item.Annotations || {};
                item.Annotations.TimeFixed = true;
            }
        }
        return resp[0];
    }
}
