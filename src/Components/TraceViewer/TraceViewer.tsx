import * as React from "react";
import { Helmet } from "react-helmet";

import { useAsyncEffect } from "../../Commons/Effects";
import { OperationAbortedError } from "../../Commons/PromiseUtils";
import { CallTreeContainer } from "../../Containers/CallTreeContainer";
import { FullCallTreeContainer } from "../../Containers/FullCallTreeContainer";
import { LayoutKind } from "../../Containers/LayoutKind/LayoutKind";
import { ProfilerChartWithMinimapContainer } from "../../Containers/ProfilerChartWithMinimapContainer";
import { SpanInfoViewContainer } from "../../Containers/SpanInfoViewContainer";
import { ContrailsErrorMessage, ErrorInfo } from "../ContrailsErrorMessage/ContrailsErrorMessage";
import { ContrailsLayout } from "../ContrailsLayout/ContrailsLayout";
import { ContrailsLoader } from "../ContrailsLoader/ContrailsLoader";
import {
    ContrailPanelsBottom,
    ContrailPanelsBottomLeft,
    ContrailPanelsBottomRight,
    ContrailPanelsContainer,
    ContrailPanelsTop,
} from "../ContrailPanels/ContrailPanels";
import { LayoutKindSelect } from "../LayoutKindSelect/LayoutKindSelect";
import { TabConfig, Tabs } from "../Tabs/Tabs";
import { TraceIdInput } from "../TraceIdInput/TraceIdInput";

import cn from "./TraceViewer.less";

interface TraceViewerProps {
    traceId: string;
    subtreeSpanId?: string;
    loadedTraceId?: string;
    loadedSubtreeSpanId?: string;

    layoutKind: LayoutKind;

    onLoadTrace: (traceId: string, subtreeSpanId: undefined | string, abortSignal?: AbortSignal) => Promise<void>;
    onChangeSubtree: (subtreeSpanId: undefined | string) => void;
    onChangeLayoutKind: (layoutKind: LayoutKind) => void;
    onOpenTrace: (traceId: string) => void;
}

export function TraceViewer(props: TraceViewerProps): JSX.Element {
    const tabs = React.useMemo<TabConfig[]>(
        () => [
            {
                name: "FullCallTree",
                caption: "Full call tree",
                renderContent: () => <FullCallTreeContainer />,
            },
            {
                name: "CallTree",
                caption: "Call tree",
                renderContent: () => <CallTreeContainer />,
            },
        ],
        []
    );

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<undefined | ErrorInfo>(undefined);

    useAsyncEffect(
        async (abortSignal: AbortSignal) => {
            if (props.loadedTraceId != undefined && props.loadedTraceId === props.traceId) {
                if (props.loadedSubtreeSpanId !== props.subtreeSpanId) {
                    props.onChangeSubtree(props.subtreeSpanId);
                }
                return;
            }
            setError(undefined);
            setLoading(true);
            try {
                await props.onLoadTrace(props.traceId, props.subtreeSpanId, abortSignal);
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
                    console.error(e);
                    setError({ errorTitle: "Упс :-(", errorMessage: "Произошла непредвиденная ошибка" });
                }
            } finally {
                if (!abortSignal.aborted) {
                    setLoading(false);
                }
            }
        },
        [props.subtreeSpanId, props.traceId]
    );

    return (
        <ContrailsLayout
            header={<HeaderContent traceId={props.traceId} onOpen={nextTraceId => props.onOpenTrace(nextTraceId)} />}
            right={<LayoutKindSelect onChange={props.onChangeLayoutKind} value={props.layoutKind} />}>
            <Helmet>
                <title>{`Trace ${props.traceId}`}</title>
            </Helmet>
            {loading && <ContrailsLoader />}
            {error && <ContrailsErrorMessage error={error} />}
            {props.loadedTraceId != undefined && (
                <ContrailPanelsContainer layoutKind={props.layoutKind}>
                    <ContrailPanelsTop>
                        <ProfilerChartWithMinimapContainer />
                    </ContrailPanelsTop>
                    <ContrailPanelsBottom>
                        <ContrailPanelsBottomLeft>
                            <Tabs tabs={tabs} />
                        </ContrailPanelsBottomLeft>
                        <ContrailPanelsBottomRight className={cn("span-info-view-container")}>
                            <SpanInfoViewContainer />
                        </ContrailPanelsBottomRight>
                    </ContrailPanelsBottom>
                </ContrailPanelsContainer>
            )}
        </ContrailsLayout>
    );
}

function HeaderContent(props: { traceId: string; onOpen: (traceId: string) => void }): JSX.Element {
    const [traceId, setTraceId] = React.useState(props.traceId);

    React.useEffect(() => setTraceId(props.traceId), [props.traceId]);

    return <TraceIdInput value={traceId} onChange={setTraceId} onOpenTrace={() => props.onOpen(traceId)} />;
}
