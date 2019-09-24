import memoizee from "memoizee";
import { Dispatch } from "redux";

import { strictDefined } from "../Commons/StrictDefined";
import { LayoutKind } from "../Containers/LayoutKind/LayoutKind";
import { LayoutKindUtils } from "../Containers/LayoutKind/LayoutKindUtils";
import { ChartData } from "../Domain/ChartData";
import { IContrailsApi } from "../Domain/IContrailsApi";
import { SpanLineItem } from "../Domain/SpanLines/SpansToLinesArranger";
import { TimeRange } from "../Domain/TimeRange";
import { TraceInfo } from "../Domain/TraceInfo";
import { SpanNode } from "../Domain/TraceTree/SpanNode";

import { ContrailsApplicationState } from "./ContrailsApplicationState";
import { TimeRangeUtils } from "./TimeRangeUtils";

export enum ActionType {
    ChangeViewPort = "ChangeViewPort",
    UpdateTrace = "UpdateTrace",
    ChangeSubtree = "ChangeSubtree",
    ResetTrace = "ResetTrace",
    ChangeFocusedNode = "ChangeFocusedNode",
    ChangeLayoutKind = "ChangeLayoutKind",
}

interface ChangeViewPortAction {
    type: ActionType.ChangeViewPort;
    payload: {
        viewPort: TimeRange;
    };
}

interface ChangeLayoutKindAction {
    type: ActionType.ChangeLayoutKind;
    payload: {
        layoutKind: LayoutKind;
    };
}

interface ChangeSubtreeAction {
    type: ActionType.ChangeSubtree;
    payload: {
        subtreeSpanId?: string;
    };
}

export interface ChangeFocusedNodeAction {
    type: ActionType.ChangeFocusedNode;
    payload: {
        focusedSpanNode: undefined | SpanNode;
    };
}

interface ResetTraceAction {
    type: ActionType.ResetTrace;
}

interface UpdateTraceAction {
    type: ActionType.UpdateTrace;
    payload: {
        traceInfo: TraceInfo;
    };
}

export type Actions =
    | ChangeViewPortAction
    | UpdateTraceAction
    | ResetTraceAction
    | ChangeFocusedNodeAction
    | ChangeSubtreeAction
    | ChangeLayoutKindAction;

export const changeLayoutKind = (layoutKind: LayoutKind) => (dispatch: Dispatch<Actions>): void => {
    LayoutKindUtils.saveLayoutKind(layoutKind);
    dispatch({ type: ActionType.ChangeLayoutKind, payload: { layoutKind: layoutKind } });
};

export const loadTrace = (traceId: string, subtreeSpanId: undefined | string, abortSignal?: AbortSignal) => async (
    dispatch: Dispatch<Actions>,
    getState: unknown,
    { api }: { api: IContrailsApi }
): Promise<void> => {
    dispatch({ type: ActionType.ResetTrace });
    const trace = await api.getTrace(traceId, abortSignal);
    dispatch({ type: ActionType.UpdateTrace, payload: { traceInfo: trace } });
    if (subtreeSpanId != undefined) {
        dispatch({ type: ActionType.ChangeSubtree, payload: { subtreeSpanId: subtreeSpanId } });
    }
};

export function changeFocusedNode(focusedNode: undefined | SpanNode): ChangeFocusedNodeAction {
    return { type: ActionType.ChangeFocusedNode, payload: { focusedSpanNode: focusedNode } };
}

function getSelectedSpanLineItem(spanLines: ChartData, focusedSpanNode?: SpanNode): SpanLineItem[] {
    if (focusedSpanNode == undefined) {
        return [];
    }
    for (const line of spanLines.lines) {
        for (const item of line.items) {
            if (item.source === focusedSpanNode) {
                return [item];
            }
        }
    }
    return [];
}

export const getSelectedSpanLineItemMemoized = memoizee(getSelectedSpanLineItem, { length: 2 });

export const changeFocusedNodeAndUpdateViewPort = (focusedNode: SpanNode) => (
    dispatch: Dispatch<Actions>,
    getState: () => ContrailsApplicationState
) => {
    const state = getState();
    const selectedItems = getSelectedSpanLineItemMemoized(strictDefined(state.spanLines), focusedNode);

    const firstSelectedItem = selectedItems[0];
    const viewPort = strictDefined(state.viewPort);
    if (!TimeRangeUtils.isItemIntersectsViewPort(viewPort, firstSelectedItem)) {
        if (firstSelectedItem.to < viewPort.from) {
            dispatch({
                type: ActionType.ChangeViewPort,
                payload: {
                    viewPort: {
                        from: firstSelectedItem.from,
                        to: viewPort.to + firstSelectedItem.from - viewPort.from,
                    },
                },
            });
        } else {
            dispatch({
                type: ActionType.ChangeViewPort,
                payload: {
                    viewPort: {
                        from: viewPort.from + firstSelectedItem.to - viewPort.to,
                        to: firstSelectedItem.to,
                    },
                },
            });
        }
    }
    dispatch({ type: ActionType.ChangeFocusedNode, payload: { focusedSpanNode: focusedNode } });
};
