import * as React from "react";
import { hot } from "react-hot-loader/root";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import { ContrailsVostokApi } from "../Domain/ContrailsVostokApi";
import { ContrailsVostokDemoApi } from "../Domain/ContrailsVostokDemoApi";
import { IContrailsApi } from "../Domain/IContrailsApi";
import { createContrailsApplicationReducer } from "../Store/ContrailsApplicationReducer";

import { ContrailsRootContainer } from "./ContrailsRootContainer";
import { LayoutKindUtils } from "./LayoutKind/LayoutKindUtils";
import { TraceViewerContainer } from "./TraceViewerContainer";

let api: IContrailsApi;
if (process.env.API_MODE === "production") {
    api = new ContrailsVostokApi("");
}
if (process.env.API_MODE === "fake") {
    api = new ContrailsVostokDemoApi();
}

function ContrailsApplicationInternal(): JSX.Element {
    const [store] = React.useState(() =>
        createStore(
            createContrailsApplicationReducer(),
            { layoutKind: LayoutKindUtils.getLayoutKind() },
            applyMiddleware(thunk.withExtraArgument({ api: api }))
        )
    );

    return (
        <Provider store={store}>
            <BrowserRouter basename={process.env.BASE_URL}>
                <Switch>
                    <Route exact path="/" component={ContrailsRootContainer} />
                    <Route path="/:traceId" component={TraceViewerContainer} />
                </Switch>
            </BrowserRouter>
        </Provider>
    );
}

export const ContrailsApplication = hot(ContrailsApplicationInternal);
