import * as H from "history";
import * as React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { match } from "react-router";

import { useAsyncEffect } from "../../Commons/Effects";
import { OperationAbortedError } from "../../Commons/PromiseUtils";
import { ContrailsErrorMessage, ErrorInfo } from "../../Components/ContrailsErrorMessage/ContrailsErrorMessage";
import { ContrailsLayout } from "../../Components/ContrailsLayout/ContrailsLayout";
import { ContrailsLoader } from "../../Components/ContrailsLoader/ContrailsLoader";
import { TraceIdInput } from "../../Components/TraceIdInput/TraceIdInput";
import { TraceViewerContainer } from "../../Components/TraceViewer/TraceViewer";
import { TraceInfo } from "../../Domain/TraceInfo";
import { ContrailsApplicationState } from "../../Store/ContrailsApplicationState";
import { loadTrace } from "../../Store/ContrailsApplicationActions";
import { ContrailsDispatch } from "../../Store/ContrailsDispatch";

interface TraceViewerContainerProps {
    history: H.History;
    match: match<{ traceIdPrefix: string }>;
    onLoadTrace: (traceId: string, abortSignal?: AbortSignal) => Promise<void>;
    traceInfo?: TraceInfo;
}

export function TraceViewerApplication(props: TraceViewerContainerProps): JSX.Element {
    const traceIdPrefix: string = props.match.params.traceIdPrefix;
    const onLoadTrace = props.onLoadTrace;
    const traceInfo = props.traceInfo;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<undefined | ErrorInfo>(undefined);

    useAsyncEffect(
        async (abortSignal: AbortSignal) => {
            setError(undefined);
            setLoading(true);
            try {
                await onLoadTrace(traceIdPrefix, abortSignal);
            } catch (e) {
                if (e instanceof Error) {
                    if (e.message === "500") {
                        setError({ errorTitle: "500", errorMessage: "Кажется что-то пошло не так :-(" });
                        return;
                    }
                    if (e.message === "404") {
                        setError({ errorTitle: "404", errorMessage: "Трассировок не найдено." });
                        return;
                    }
                }
                if (!(e instanceof OperationAbortedError)) {
                    setError({ errorTitle: "Упс :-(", errorMessage: "Произошла непредвиденная ошибка" });
                }
            } finally {
                if (!abortSignal.aborted) {
                    setLoading(false);
                }
            }
        },
        [traceIdPrefix]
    );

    return (
        <ContrailsLayout
            header={
                <HeaderContent traceId={traceIdPrefix} onOpen={nextTraceId => props.history.push(`/${nextTraceId}`)} />
            }>
            <Helmet>
                <title>{`Trace ${traceIdPrefix}`}</title>
            </Helmet>
            {loading && <ContrailsLoader />}
            {error && <ContrailsErrorMessage error={error} />}
            {traceInfo != undefined && <TraceViewerContainer />}
        </ContrailsLayout>
    );
}

function HeaderContent(props: { traceId: string; onOpen: (traceId: string) => void }): JSX.Element {
    const [traceId, setTraceId] = React.useState(props.traceId);

    React.useEffect(() => setTraceId(props.traceId), [props.traceId]);

    return <TraceIdInput value={traceId} onChange={setTraceId} onOpenTrace={() => props.onOpen(traceId)} />;
}

const mapProps = (state: ContrailsApplicationState) => ({
    traceInfo: state.traceInfo,
});

const mapDispatch = (dispatch: ContrailsDispatch) => ({
    onLoadTrace: (traceId: string, abortSignal?: AbortSignal) => dispatch(loadTrace(traceId, abortSignal)),
});

export const TraceViewerApplicationContainer = connect(
    mapProps,
    mapDispatch
)(TraceViewerApplication);
