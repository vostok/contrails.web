// @flow
import PromiseUtils from "commons/PromiseUtils";

import type { TraceInfo } from "./TraceInfo";
import type { IContrailsApi } from "./IContrailsApi";

const ResponsesContext = require.context("./Responses", true, /.json$/);

export default class ContrailsApiFake implements IContrailsApi {
    async getTrace(id: string): Promise<TraceInfo[]> {
        //await PromsieUtils.delay(2000);
        const result = ResponsesContext.keys().find(x => x.replace(/^\.\//, "").startsWith(id));
        if (result != null) {
            return ResponsesContext(result);
        }
        throw new Error("NotFound");
        // if ("37fa1a7edcc34ca28204fc50e6681e70".startsWith(id)) {
        //     return Response37fa1a7edcc34ca28204fc50e6681e70;
        // }
        // return Response62f8278dab21471c8370fa47d4f52f72;
    }
}
