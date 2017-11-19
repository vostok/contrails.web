// @flow
/* eslint-disable import/prefer-default-export */
import PromiseUtils from "commons/PromiseUtils";

import Examples from "../Responses/Examples";
import type { TraceInfo } from "../TraceInfo";

import { fixLogsearchClientServerSpan } from "./ContrailsLogsearchApi";
import type { IContrailsApi } from "./IContrailsApi";

if (process.env.NODE_ENV === "production") {
    console.warn("This file should not appears in production");
}

export class ContrailsApiFake implements IContrailsApi {
    async getTrace(id: string): Promise<TraceInfo> {
        await PromiseUtils.delay(600);
        if (Object.keys(Examples).includes(id)) {
            return Examples[id];
        }
        const response = await fetch(`/src/Domain/Responses/${id}.json`);
        if (response.status !== 200) {
            if (response.status === 404) {
                throw new Error("404");
            }
            throw new Error("500");
        }
        const resp = await response.json();
        if (resp.length === 0) {
            throw new Error("404");
        }
        resp[0].Spans = fixLogsearchClientServerSpan(resp[0].Spans);
        return resp[0];
    }
}
