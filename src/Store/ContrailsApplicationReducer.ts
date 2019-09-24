import { Reducer } from "redux";

import { ChartData } from "../Domain/ChartData";
import { IDataExtractor, VostokDataExtractor } from "../Domain/IDataExtractor";
import { SpanInfo } from "../Domain/SpanInfo";
import { SpansToLinesArranger } from "../Domain/SpanLines/SpansToLinesArranger";
import { TimeRange } from "../Domain/TimeRange";
import { LostSpanFixer, SpanFactory } from "../Domain/TraceTree/LostSpanFixer";
import { SpanNode } from "../Domain/TraceTree/SpanNode";
import { TraceTreeBuilder } from "../Domain/TraceTree/TraceTreeBuilder";
import { TraceTreeTimeFixer } from "../Domain/TraceTreeTimeFixer";

import { Actions, ActionType } from "./ContrailsApplicationActions";
import { ContrailsApplicationState } from "./ContrailsApplicationState";

function findSpanNode(traceTree: SpanNode, subtreeSpanId: string): undefined | SpanNode {
    if (traceTree.source.SpanId === subtreeSpanId) {
        return traceTree;
    }
    for (const child of traceTree.children) {
        const result = findSpanNode(child, subtreeSpanId);
        if (result != undefined) {
            return result;
        }
    }
    return undefined;
}

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
                totalTimeRange: undefined,
                viewPort: undefined,

                subtreeTimeRange: undefined,
                currentTraceSubtree: undefined,
                currentSpanLines: undefined,
            };
        }
        if (action.type === ActionType.UpdateTrace) {
            const traceInfo = action.payload.traceInfo;
            const recoveredSpan = lostSpanFixer.fix(traceInfo.Spans, fakeSpanFactory(traceInfo.TraceId));
            const traceTree = treeBuilder.buildTraceTree(recoveredSpan);
            const traceTreeTimeFixer = new TraceTreeTimeFixer(traceTree, dataExtractor);
            traceTreeTimeFixer.fix();

            const spanLines = generateDataFromDiTraceResponse(traceTree);
            const totalTimeRange = getFromAndToFromTraceTree(traceTree);
            return {
                ...state,
                traceInfo: action.payload.traceInfo,
                // @ts-ignore Понять зачем тут строится этот мап
                // spanNodesMap: treeBuilder.buildNodeMap(traceTree),
                totalTimeRange: totalTimeRange,

                traceTree: traceTree,
                spanLines: spanLines,

                currentTraceSubtree: traceTree,
                currentSpanLines: spanLines,
                subtreeTimeRange: totalTimeRange,

                viewPort: totalTimeRange,
            };
        }

        if (action.type === ActionType.ChangeSubtree) {
            const subtreeSpanId = action.payload.subtreeSpanId;
            if (subtreeSpanId == undefined) {
                return {
                    ...state,
                    currentTraceSubtree: state.traceTree,
                    currentSpanLines: state.spanLines,
                    subtreeTimeRange: state.totalTimeRange,
                };
            } else if (state.traceTree != undefined) {
                const traceSubtree = findSpanNode(state.traceTree, subtreeSpanId);
                if (traceSubtree == undefined) {
                    throw new Error("Span id not found");
                }
                const totalTimeRange = getFromAndToFromTraceTree(traceSubtree);
                const currentSpanLines = generateDataFromDiTraceResponse(traceSubtree);
                return {
                    ...state,
                    currentTraceSubtree: traceSubtree,
                    currentSpanLines: currentSpanLines,
                    subtreeTimeRange: totalTimeRange,
                    viewPort: totalTimeRange,
                    focusedSpanNode: traceSubtree,
                };
            }
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

function getFromAndToFromTraceTree(traceTree: SpanNode): TimeRange {
    let minFrom = traceTree.from;
    let maxTo = traceTree.to;
    for (const child of traceTree.children) {
        const childBounds = getFromAndToFromTraceTree(child);
        minFrom = Math.min(childBounds.from, minFrom);
        maxTo = Math.max(childBounds.to, maxTo);
    }
    return { from: minFrom, to: maxTo };
}
