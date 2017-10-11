// @flow
import type { TraceInfo } from "./TraceInfo";

export interface IContrailsApi {
    getTrace(id: string): Promise<TraceInfo>,
}
