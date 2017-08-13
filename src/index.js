// @flow
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

import ContrailsApplication from "./containers/ContrailsApplication";

import "./styles/reset.less";
import "./styles/typography.less";
import "./styles/root.less";

const rootEl = document.getElementById("root");

function render(Component: Class<React.Component<any, void, any>>) {
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
