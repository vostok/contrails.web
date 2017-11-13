// @flow
/* eslint-disable global-require, no-inner-declarations, import/no-unassigned-import */
import * as React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import ContrailsApplication from "./containers/ContrailsApplication";
import contrailsApplicationReducer from "./reducer/contrailsApplicationReducer";

import "./styles/reset.less";
import "./styles/typography.less";
import "./styles/root.less";

const rootEl = document.getElementById("root");
const store = createStore(contrailsApplicationReducer);

if (rootEl == null) {
    throw new Error("Cannot find #root element to render react content into/");
}

if (process.env.NODE_ENV === "development") {
    const { AppContainer } = require("react-hot-loader");

    function render(Component: React.ComponentType<{||}>) {
        ReactDOM.render(
            <AppContainer>
                <Provider store={store}>
                    <Component />
                </Provider>
            </AppContainer>,
            rootEl
        );
    }

    render(ContrailsApplication);

    if (module.hot) {
        module.hot.accept("./containers/ContrailsApplication", () => render(ContrailsApplication));
    }
} else {
    ReactDOM.render(
        <Provider store={store}>
            <ContrailsApplication />
        </Provider>,
        rootEl
    );
}
