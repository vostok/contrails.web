// @flow
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

import ContrailsApplication from "./containers/ContrailsApplication";

import "./styles/reset.less";
import "./styles/typography.less";
import "./styles/root.less";

const rootEl = document.getElementById("root");

// (async function () {
//     const result = await fetch("http://logsearchapi.dev.kontur:30002/findTrace?traceId=e3f7c710&out=vostok", { method: "GET" });
//     console.log(result)
//     const a = await result.text();
//     console.log(a);
// })();

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
