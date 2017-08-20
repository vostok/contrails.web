// @flow
import PromsieUtils from "commons/PromiseUtils";

import type { TraceInfo } from "./TraceInfo";
import type { IContrailsApi } from "./IContrailsApi";
import Response62f8278dab21471c8370fa47d4f52f72 from "./Responses/62f8278dab21471c8370fa47d4f52f72.json";

export default class ContrailsApiFake implements IContrailsApi {
    async getTrace(_id: string): Promise<TraceInfo[]> {
        await PromsieUtils.delay(10000);
        return Response62f8278dab21471c8370fa47d4f52f72;
    }
}
