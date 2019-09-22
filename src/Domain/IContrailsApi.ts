import { TraceInfo } from "./TraceInfo";

export interface IContrailsApi {
    getTrace(id: string, abortSignal?: AbortSignal): Promise<TraceInfo>;
}
