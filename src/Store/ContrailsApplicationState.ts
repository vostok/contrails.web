import { TimeRange } from "../Domain/TimeRange";
import { TraceInfo } from "../Domain/TraceInfo";
import { SpanNode } from "../Domain/TraceTree/SpanNode";

import { ChartData } from "../Domain/ChartData";

export interface ContrailsApplicationState {
    viewPort?: TimeRange;
    traceTree?: SpanNode;
    traceInfo?: TraceInfo;
    spanLines?: ChartData;
    timeRange?: TimeRange;
    focusedSpanNode?: SpanNode;
}
