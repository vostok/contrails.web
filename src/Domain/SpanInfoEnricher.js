// @flow
import type { SpanInfo } from "./SpanInfo";
import type { EnrichedSpanInfo } from "./EnrichedSpanInfo";
import SpansToLinesArranger from "./SpanLines/SpansToLinesArranger";
import { transformTree, buildTree } from "./TreeTransformation";
import FixLostSpanNodeTransformer, { type SpanFactory } from "./TraceTree/FixLostSpanNodeTransformer";
import {
    AddSimplifiedBoundsToNodeTrasformer,
    AddColorConfigNodeTrasformer,
    AddReferenceToParentNodeTrasformer,
    AddCommonPropertiesNodeTrasformer,
} from "./SpanInfoTransformers";

export type SpanLines = Array<{ items: Array<EnrichedSpanInfo> }>;

function fakeSpanFactory(traceId: string): any {
    return (spanId: string, parentSpanId: ?string, beginTimestamp: string, endTimestamp: string): EnrichedSpanInfo => ({
        TraceId: traceId,
        SpanId: spanId,
        ParentSpanId: parentSpanId,
        OperationName: "FakeSpan",
        BeginTimestamp: beginTimestamp,
        EndTimestamp: endTimestamp,
        from: 1,
        to: 2,
        colorConfig: 0,
        parent: null,
        children: [],
        serviceName: "Fake span",
        serviceTitle: "",
        Annotations: {},
    });
}

export function buildTreeFromSpanInfos(spans: Array<SpanInfo>): EnrichedSpanInfo {
    const tree = buildTree(spans);
    const traceId = tree[0].TraceId;
    const transformedTree: any = transformTree(tree, [
        new AddSimplifiedBoundsToNodeTrasformer(),
        new FixLostSpanNodeTransformer(fakeSpanFactory(traceId)),
        new AddReferenceToParentNodeTrasformer(),
        new AddColorConfigNodeTrasformer(),
        new AddCommonPropertiesNodeTrasformer(),
    ]);
    return transformedTree;
}

export function arrangeSpanInfos(spans: Array<SpanInfo>): SpanLines {
    const transformedTree = buildTreeFromSpanInfos(spans);
    const arranger = new SpansToLinesArranger();
    return arranger.arrange(transformedTree);
}

export function buildTreeAndArrangeSpanInfos(spans: Array<SpanInfo>): { tree: EnrichedSpanInfo, lines: SpanLines } {
    const transformedTree = buildTreeFromSpanInfos(spans);
    const arranger = new SpansToLinesArranger();
    const lines = arranger.arrange(transformedTree);
    return {
        tree: transformedTree,
        lines: lines,
    };
}
