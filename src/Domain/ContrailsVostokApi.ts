import { IContrailsApi } from "./IContrailsApi";
import { TraceInfo } from "./TraceInfo";
import { vostokResponseToTraceInfo } from "./VostokResponseToTraceInfo";
import { VostokSpanInfo } from "./VostokSpanInfo";
import Toast from "@skbkontur/react-ui/Toast";

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
        const response = await fetch(`${this.urlPrefix}/api/search?traceId=${id}&limit=${limit}`, {
            headers: ContrailsVostokApi.additionalHeaders,
            signal: abortSignal,
        });
        if (response.status !== 200) {
            throw new Error(response.status.toString());
        }
        // tslint:disable no-unsafe-any
        const resp: VostokSpanInfo[] = await response.json();
        const trace = vostokResponseToTraceInfo(resp);
        if (trace.Spans.length > limit) {
            Toast.push(`Only the first ${trace.Spans.length} spans have been shown.`, {
                label: "Ok",
                // tslint:disable-next-line:no-empty
                handler: () => {},
            });
        }
        return trace;
    }
}
