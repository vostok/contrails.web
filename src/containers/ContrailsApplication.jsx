// @flow
/* eslint-disable global-require */
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router";

import { ApiProvider } from "../Domain/Api/ContrailsApiInjection";

import TraceViewerContainer from "./TraceViewerContainer";
import ContrailsRootContainer from "./ContrailsRootContainer";

let api;
if (process.env.API_MODE === "fake" && process.env.API_TARGET === "logsearch") {
    const ContrailsApiFake = require("../Domain/Api/ContrailsApiFake");
    api = new ContrailsApiFake.ContrailsApiFake();
}
if (process.env.API_MODE === "production" && process.env.API_TARGET === "vostok") {
    const ContrailsApi = require("../Domain/Api/ContrailsVostokApi");
    api = new ContrailsApi.ContrailsVostokApi("");
}
if (process.env.API_MODE === "production" && process.env.API_TARGET === "logsearch") {
    const ContrailsApi = require("../Domain/Api/ContrailsLogsearchApi");
    api = new ContrailsApi.ContrailsLogsearchApi(process.env.BASE_URL || "");
}

export default function ContrailsApplication(): React.Node {
    return (
        <ApiProvider contrailsApi={api}>
            <BrowserRouter basename={process.env.BASE_URL}>
                <Switch>
                    <Route exact path="/">
                        <ContrailsRootContainer />
                    </Route>
                    <Route
                        path="/:traceIdPrefix"
                        component={({ match }) =>
                            typeof match.params.traceIdPrefix === "string" && (
                                <TraceViewerContainer traceIdPrefix={match.params.traceIdPrefix} />
                            )
                        }
                    />
                </Switch>
            </BrowserRouter>
        </ApiProvider>
    );
}
