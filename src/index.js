// @flow
/* eslint-disable global-require */
/* eslint-disable no-inner-declarations */
import * as React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import ContrailsApplication from "./containers/ContrailsApplication";

import "./styles/reset.less";
import "./styles/typography.less";
import "./styles/root.less";

function contrailsApplicationReducer(state = {}, action) {
    if (action.type === "ChangeViewPort") {
        return {
            ...state,
            viewPort: action.viewPort,
        };
    }
    return state;
}

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
