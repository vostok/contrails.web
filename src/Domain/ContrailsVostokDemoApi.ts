import { PromiseUtils } from "../Commons/PromiseUtils";

import { IContrailsApi } from "./IContrailsApi";
import { TraceInfo } from "./TraceInfo";
import { vostokResponseToTraceInfo } from "./VostokResponseToTraceInfo";
import { VostokSpanInfo } from "./VostokSpanInfo";

export class ContrailsVostokDemoApi implements IContrailsApi {
    public static additionalHeaders = {
        "Cache-Control": "no-cache, no-store",
        Pragma: "no-cache",
        Expires: "0",
        credentials: "same-origin",
    };

    public async getTrace(id: string, abortSignal?: AbortSignal): Promise<TraceInfo> {
        await PromiseUtils.delay(2000, abortSignal);
        const response = await fetch(`/src/Domain/Responses/${id}.json`, {
            headers: ContrailsVostokDemoApi.additionalHeaders,
            signal: abortSignal,
        });
        const responseContentType = response.headers.get("Content-Type");
        if (responseContentType != undefined && responseContentType.includes("text/html;")) {
            throw new Error("404");
        }
        if (response.status !== 200) {
            throw new Error("500");
        }
        // tslint:disable no-unsafe-any
        const resp: VostokSpanInfo[] = await response.json();
        return vostokResponseToTraceInfo(resp);
    }
}
