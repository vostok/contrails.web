import { LayoutKind } from "../Containers/LayoutKind/LayoutKind";
import { ChartData } from "../Domain/ChartData";
import { TimeRange } from "../Domain/TimeRange";
import { TraceInfo } from "../Domain/TraceInfo";
import { SpanNode } from "../Domain/TraceTree/SpanNode";

export interface ContrailsApplicationState {
    layoutKind: LayoutKind;
    traceInfo?: TraceInfo;

    totalTimeRange?: TimeRange;
    traceTree?: SpanNode;
    spanLines?: ChartData;

    subtreeTimeRange?: TimeRange;
    currentTraceSubtree?: SpanNode;
    currentSpanLines?: ChartData;

    viewPort?: TimeRange;
    focusedSpanNode?: SpanNode;
}
