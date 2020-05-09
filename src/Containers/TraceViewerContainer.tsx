import * as H from "history";
import { connect } from "react-redux";
import { match } from "react-router";

import { TraceViewer } from "../Components/TraceViewer/TraceViewer";
import { ActionType, changeLayoutKind, loadTrace } from "../Store/ContrailsApplicationActions";
import { ContrailsApplicationState } from "../Store/ContrailsApplicationState";
import { ContrailsDispatch } from "../Store/ContrailsDispatch";

import { LayoutKind } from "./LayoutKind/LayoutKind";

interface TraceViewerContainerProps {
    history: H.History;
    location: H.Location;
    match: match<{ traceId: string }>;
}

const mapProps = (state: ContrailsApplicationState, ownProps: TraceViewerContainerProps) => ({
    loadedTraceId: state.traceInfo == undefined ? undefined : state.traceInfo.TraceId,
    loadedSubtreeSpanId: state.currentTraceSubtree == undefined ? undefined : state.currentTraceSubtree.source.SpanId,
    layoutKind: state.layoutKind,
    traceId: ownProps.match.params.traceId,
    subtreeSpanId: extractSubtreeSpanId(ownProps.location),
});

const mapDispatch = (dispatch: ContrailsDispatch, ownProps: TraceViewerContainerProps) => ({
    onLoadTrace: (traceId: string, subtreeSpanId: undefined | string, abortSignal?: AbortSignal) =>
        dispatch(loadTrace(traceId, subtreeSpanId, abortSignal)),
    onChangeSubtree: (subtreeSpanId: undefined | string) =>
        dispatch({ type: ActionType.ChangeSubtree, payload: { subtreeSpanId: subtreeSpanId } }),
    onOpenTrace: (traceId: string) => ownProps.history.push(`/${traceId}`),
    onChangeLayoutKind: (layoutKind: LayoutKind) => dispatch(changeLayoutKind(layoutKind)),
});

export const TraceViewerContainer = connect(mapProps, mapDispatch)(TraceViewer);

function extractSubtreeSpanId(location: H.Location): undefined | string {
    if (location.hash != undefined) {
        const spanIdMatch = /#(.*?)#(.*?)$/.exec(location.hash);
        if (spanIdMatch != undefined) {
            return spanIdMatch[2];
        }
    }
    return undefined;
}
