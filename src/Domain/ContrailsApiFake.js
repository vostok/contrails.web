// @flow
import PromiseUtils from "commons/PromiseUtils";

import type { TraceInfo } from "./TraceInfo";
import type { IContrailsApi } from "./IContrailsApi";
import responses from "./Responses";

export default class ContrailsApiFake implements IContrailsApi {
    async getTrace(id: string): Promise<TraceInfo[]> {
        await PromiseUtils.delay(2000);
        const result = Object.keys(responses).find(x => x.replace(/^\.\//, "").startsWith(id));
        if (result != null) {
            return responses[result];
        }
        throw new Error("NotFound");
    }
}
