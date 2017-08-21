// @flow
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router";

import { ApiProvider } from "../Domain/ContrailsApiInjection";
import ContrailsApiFake from "../Domain/ContrailsApiFake";

import TraceViewer from "./TraceViewer";

const api = new ContrailsApiFake();

export default function ContrailsApplication(): React.Node {
    return (
        <ApiProvider contrailsApi={api}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/">
                        <div>Root</div>
                    </Route>
                    <Route
                        path="/:traceIdPrefix"
                        component={({ match }) => <TraceViewer traceIdPrefix={match.params.traceIdPrefix} />}
                    />
                </Switch>
            </BrowserRouter>
        </ApiProvider>
    );
}
