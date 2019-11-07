import * as H from "history";
import * as React from "react";

import { ContrailsLayout } from "../Components/ContrailsLayout/ContrailsLayout";
import { TraceIdInput } from "../Components/TraceIdInput/TraceIdInput";

interface ContrailsRootContainerProps {
    history: H.History;
}

export function ContrailsRootContainer({ history }: ContrailsRootContainerProps): JSX.Element {
    const [traceId, setTraceId] = React.useState("");

    return (
        <ContrailsLayout>
            <ContrailsLayout.Center>
                <TraceIdInput value={traceId} onChange={setTraceId} onOpenTrace={() => history.push(`/${traceId}`)} />
            </ContrailsLayout.Center>
        </ContrailsLayout>
    );
}
