import { IContrailsApi } from "./IContrailsApi";
import { TraceInfo } from "./TraceInfo";
import { vostokResponseToTraceInfo } from "./VostokResponseToTraceInfo";
import { VostokSpanInfo } from "./VostokSpanInfo";

export class ContrailsVostokApi implements IContrailsApi {
    private readonly urlPrefix: string;

    private static readonly additionalHeaders = {
        "Cache-Control": "no-cache, no-store",
        Pragma: "no-cache",
        Expires: "0",
        credentials: "same-origin",
    };

    public constructor(urlPrefix: string) {
        this.urlPrefix = urlPrefix;
    }

    public async getTrace(id: string, abortSignal?: AbortSignal): Promise<TraceInfo> {
        const response = await fetch(`${this.urlPrefix}/api/search?traceId=${id}`, {
            headers: ContrailsVostokApi.additionalHeaders,
            signal: abortSignal,
        });
        if (response.status !== 200) {
            throw new Error("500");
        }
        // tslint:disable no-unsafe-any
        const resp: VostokSpanInfo[] = await response.json();
        return vostokResponseToTraceInfo(resp);
    }
}
