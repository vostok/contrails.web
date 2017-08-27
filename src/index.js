// @flow
import * as React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

import ContrailsApplication from "./containers/ContrailsApplication";

import "./styles/reset.less";
import "./styles/typography.less";
import "./styles/root.less";

const rootEl = document.getElementById("root");

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
