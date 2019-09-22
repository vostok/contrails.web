import * as React from "react";
import ReactDOM from "react-dom";

import { ContrailsApplication } from "./Containers/ContrailsApplication";
import "./Styles/Reset.less";
import "./Styles/Root.less";
import "./Styles/Typography.less";
import { wheelPreventDefaultChromeWorkaround } from "./WheelPreventDefaultChromeWorkaround";

const rootEl = document.getElementById("root");

wheelPreventDefaultChromeWorkaround();

if (rootEl == undefined) {
    throw new Error("Cannot find #root element to render react content into/");
}

if (process.env.NODE_ENV === "development") {
    import("react-hot-loader")
        .then(({ AppContainer }) => {
            function render(Component: React.ComponentType): void {
                ReactDOM.render(
                    <AppContainer>
                        <Component />
                    </AppContainer>,
                    rootEl
                );
            }

            render(ContrailsApplication);

            if (module.hot) {
                module.hot.accept("./Containers/ContrailsApplication", () => render(ContrailsApplication));
            }
        })
        .catch(e => console.error(e));
} else {
    ReactDOM.render(<ContrailsApplication />, rootEl);
}
