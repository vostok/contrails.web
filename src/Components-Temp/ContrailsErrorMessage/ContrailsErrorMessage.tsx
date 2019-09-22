import * as React from "react";

import cn from "./ContrailsErrorMessage.less";

export interface ErrorInfo {
    errorTitle: string;
    errorMessage: string;
}

interface ContrailsErrorMessageProps {
    error: ErrorInfo;
}

export function ContrailsErrorMessage({ error }: ContrailsErrorMessageProps): JSX.Element {
    return (
        <div className={cn("error-container")}>
            <div>
                <h1>{error.errorTitle}</h1>
                <div className={cn("message")}>{error.errorMessage}</div>
            </div>
        </div>
    );
}
