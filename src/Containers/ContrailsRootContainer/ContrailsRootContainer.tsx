import * as H from "history";
import * as React from "react";

import { ContrailsLayout } from "../../Components/ContrailsLayout/ContrailsLayout";
import { TraceIdInput } from "../../Components/TraceIdInput/TraceIdInput";

import cn from "./ContrailsRootContainer.less";

interface ContrailsRootContainerProps {
    history: H.History;
}

export function ContrailsRootContainer({ history }: ContrailsRootContainerProps): JSX.Element {
    const [traceId, setTraceId] = React.useState("");

    return (
        <ContrailsLayout>
            <div className={cn("content")}>
                <TraceIdInput value={traceId} onChange={setTraceId} onOpenTrace={() => history.push(`/${traceId}`)} />
            </div>
        </ContrailsLayout>
    );
}
