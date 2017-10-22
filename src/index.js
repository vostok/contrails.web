// @flow
/* eslint-disable global-require */
/* eslint-disable no-inner-declarations */
import * as React from "react";
import ReactDOM from "react-dom";

import ContrailsApplication from "./containers/ContrailsApplication";

import "./styles/reset.less";
import "./styles/typography.less";
import "./styles/root.less";

const rootEl = document.getElementById("root");

if (rootEl == null) {
    throw new Error("Cannot find #root element to render react content into/");
}

if (process.env.NODE_ENV === "development") {
    const { AppContainer } = require("react-hot-loader");

    function render(Component: React.ComponentType<{||}>) {
        ReactDOM.render(
            <AppContainer>
                <Component />
            </AppContainer>,
            rootEl
        );
    }

    render(ContrailsApplication);

    if (module.hot) {
        module.hot.accept("./containers/ContrailsApplication", () => render(ContrailsApplication));
    }
} else {
    ReactDOM.render(<ContrailsApplication />, rootEl);
}
