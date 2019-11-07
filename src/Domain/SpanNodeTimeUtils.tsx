import { SpanNode } from "./TraceTree/SpanNode";
import { TraceTreeUtils } from "./TraceTree/TraceTreeUtils";

export class SpanNodeTimeUtils {
    private static readonly getSpanNodeSelfTimeCache: Map<string, number> = new Map();

    public static getSpanNodeTotalTimePercentage(traceTree: SpanNode, spanNode: SpanNode): number {
        const rootNodeTotalTile = traceTree.to - traceTree.from;
        return this.getSpanNodeTime(traceTree, spanNode) / rootNodeTotalTile;
    }

    public static getSpanNodeTime(traceTree: SpanNode, spanNode: SpanNode): number {
        return spanNode.to - spanNode.from;
    }

    public static getSpanNodeSelfTimePercentage(traceTree: SpanNode, spanNode: SpanNode): number {
        const rootNodeTotalTile = traceTree.to - traceTree.from;
        return this.getSpanNodeSelfTime(traceTree, spanNode) / rootNodeTotalTile;
    }

    public static getSpanNodeSelfTime(traceTree: SpanNode, spanNode: SpanNode): number {
        const mapKey = `${traceTree.source.SpanId}-${spanNode.source.SpanId}`;
        let result = this.getSpanNodeSelfTimeCache.get(mapKey);
        if (result == undefined) {
            result = TraceTreeUtils.getSpanNodeSelfTime(spanNode);
            this.getSpanNodeSelfTimeCache.set(mapKey, result);
        }
        return result;
    }
}
