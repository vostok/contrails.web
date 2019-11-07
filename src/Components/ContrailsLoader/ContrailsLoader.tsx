import * as React from "react";

import { Spinner } from "../../Commons/ui";

import cn from "./ContrailsLoader.less";

export function ContrailsLoader(): JSX.Element {
    return (
        <div className={cn("loader-container")}>
            <div className={cn("message")}>
                <Spinner type="mini" caption="Loading..." />
            </div>
        </div>
    );
}
