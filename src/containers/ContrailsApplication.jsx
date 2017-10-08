// @flow
/* eslint-disable global-require */
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router";

import { ApiProvider } from "../Domain/ContrailsApiInjection";

import TraceViewerContainer from "./TraceViewerContainer";
import ContrailsRootContainer from "./ContrailsRootContainer";

let api;
if (process.env.API === "fake") {
    const ContrailsApiFake = require("../Domain/ContrailsApiFake");
    api = new ContrailsApiFake.ContrailsApiFake();
} else {
    const ContrailsApi = require("../Domain/ContrailsApi");
    api = new ContrailsApi.ContrailsApi();
}

export default function ContrailsApplication(): React.Node {
    return (
        <ApiProvider contrailsApi={api}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/">
                        <ContrailsRootContainer />
                    </Route>
                    <Route
                        path="/:traceIdPrefix"
                        component={({ match }) =>
                            typeof match.params.traceIdPrefix === "string" &&
                            <TraceViewerContainer traceIdPrefix={match.params.traceIdPrefix} />}
                    />
                </Switch>
            </BrowserRouter>
        </ApiProvider>
    );
}
