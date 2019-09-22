import { Reducer } from "redux";

import { ChartData } from "../Domain/ChartData";
import { IDataExtractor, VostokDataExtractor } from "../Domain/IDataExtractor";
import { SpanInfo } from "../Domain/SpanInfo";
import { SpansToLinesArranger } from "../Domain/SpanLines/SpansToLinesArranger";
import { TimeRange } from "../Domain/TimeRange";
import { TraceInfo, TraceInfoUtils } from "../Domain/TraceInfo";
import { LostSpanFixer, SpanFactory } from "../Domain/TraceTree/LostSpanFixer";
import { SpanNode } from "../Domain/TraceTree/SpanNode";
import { TraceTreeBuilder } from "../Domain/TraceTree/TraceTreeBuilder";

import { Actions, ActionType } from "./ContrailsApplicationActions";
import { ContrailsApplicationState } from "./ContrailsApplicationState";
import { TraceTreeTimeFixer } from "./TraceTreeTimeFixer";

export function createContrailsApplicationReducer(
    dataExtractor: IDataExtractor = new VostokDataExtractor()
): Reducer<ContrailsApplicationState, Actions> {
    const treeBuilder = new TraceTreeBuilder(dataExtractor);
    const lostSpanFixer = new LostSpanFixer();

    return function contrailsApplicationReducer(
        state: ContrailsApplicationState = {},
        action: Actions
    ): ContrailsApplicationState {
        if (action.type === ActionType.ChangeViewPort) {
            return {
                ...state,
                viewPort: action.payload.viewPort,
            };
        }
        if (action.type === ActionType.ChangeFocusedNode) {
            return {
                ...state,
                focusedSpanNode: action.payload.focusedSpanNode,
            };
        }
        if (action.type === ActionType.ResetTrace) {
            return {
                ...state,
                traceInfo: undefined,
                spanLines: undefined,
                timeRange: undefined,
                viewPort: undefined,
            };
        }
        if (action.type === ActionType.UpdateTrace) {
            const traceInfo = action.payload.traceInfo;
            const recoveredSpan = lostSpanFixer.fix(traceInfo.Spans, fakeSpanFactory(traceInfo.TraceId));
            const traceTree = treeBuilder.buildTraceTree(recoveredSpan);
            const traceTreeTimeFixer = new TraceTreeTimeFixer(traceTree, dataExtractor);
            traceTreeTimeFixer.fix();

            return {
                ...state,
                traceInfo: action.payload.traceInfo,
                // @ts-ignore Понять зачем тут строится этот мап
                // spanNodesMap: treeBuilder.buildNodeMap(traceTree),
                traceTree: traceTree,
                spanLines: generateDataFromDiTraceResponse(traceTree),
                timeRange: getFromAndTo(traceInfo),
                viewPort: getFromAndTo(traceInfo),
            };
        }
        return state;
    };
}

function fakeSpanFactory(traceId: string): SpanFactory<SpanInfo> {
    return (
        spanId: string,
        parentSpanId: undefined | string,
        beginTimestamp: string,
        endTimestamp: string
    ): SpanInfo => ({
        TraceId: traceId,
        SpanId: spanId,
        ParentSpanId: parentSpanId,
        OperationName: "FakeSpan",
        BeginTimestamp: beginTimestamp,
        EndTimestamp: endTimestamp,
        Annotations: {},
    });
}

function generateDataFromDiTraceResponse(traceTree: SpanNode): ChartData {
    const arranger = new SpansToLinesArranger();
    return { lines: arranger.arrange(traceTree) };
}

function getFromAndTo(traceInfo: TraceInfo): TimeRange {
    return TraceInfoUtils.getTraceTimeRange(traceInfo.Spans);
}
