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
        const limit = 10000;
        const response = await fetch(`${this.urlPrefix}/api/trace?traceId=${id}&limit=${limit}`, {
            headers: ContrailsVostokApi.additionalHeaders,
            signal: abortSignal,
        });
        if (response.status !== 200) {
            throw new Error(response.status.toString());
        }
        // tslint:disable no-unsafe-any
        const rawResponse: any = await response.json();
        const resp: VostokSpanInfo[] = 'result' in rawResponse ? rawResponse.result : rawResponse
        const trace = vostokResponseToTraceInfo(resp);
        if (trace.Spans.length > limit) {
            alert(`Only the first ${trace.Spans.length} spans will be shown`);
        }
        return trace;
    }
}
