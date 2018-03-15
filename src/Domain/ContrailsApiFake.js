// @flow
/* eslint-disable import/prefer-default-export */
import PromiseUtils from "commons/PromiseUtils";

import buildExamples from "../Domain/Responses/Examples";
import type { ExampleTraceInfosMap } from "../Domain/Responses/Examples";

import { fixLogsearchClientServerSpan } from "./ContrailsLogsearchApi";
import type { TraceInfo } from "./TraceInfo";
import type { IContrailsApi } from "./IContrailsApi";

if (process.env.NODE_ENV === "production") {
    console.warn("This file should not appears in production");
}

export class ContrailsApiFake implements IContrailsApi {
    examples: ExampleTraceInfosMap;

    constructor() {
        this.examples = buildExamples("logsearch");
    }

    async getTrace(id: string): Promise<TraceInfo> {
        await PromiseUtils.delay(600);
        if (Object.keys(this.examples).includes(id)) {
            return this.examples[id];
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
