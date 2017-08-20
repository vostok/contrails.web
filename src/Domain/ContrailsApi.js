// @flow
import PromsieUtils from "commons/PromiseUtils";

import type { TraceInfo } from "./TraceInfo";
import type { IContrailsApi } from "./IContrailsApi";

export default class ContrailsApi implements IContrailsApi {
    async getTrace(_id: string): Promise<TraceInfo[]> {
        await PromsieUtils.delay(100);
        throw new Error("NotImplementedError");
    }
}
