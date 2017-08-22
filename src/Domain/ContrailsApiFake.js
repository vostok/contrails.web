// @flow
import PromsieUtils from "commons/PromiseUtils";

import type { TraceInfo } from "./TraceInfo";
import type { IContrailsApi } from "./IContrailsApi";
import Response62f8278dab21471c8370fa47d4f52f72 from "./Responses/62f8278dab21471c8370fa47d4f52f72.json";
import Response37fa1a7edcc34ca28204fc50e6681e70 from "./Responses/37fa1a7edcc34ca28204fc50e6681e70.json";

export default class ContrailsApiFake implements IContrailsApi {
    async getTrace(id: string): Promise<TraceInfo[]> {
        await PromsieUtils.delay(10000);
        if ("37fa1a7edcc34ca28204fc50e6681e70".startsWith(id)) {
            return Response37fa1a7edcc34ca28204fc50e6681e70;
        }
        return Response62f8278dab21471c8370fa47d4f52f72;
    }
}
