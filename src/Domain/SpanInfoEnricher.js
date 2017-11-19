// @flow
import type { SpanInfo } from "./SpanInfo";
import type { EnrichedSpanInfo } from "./EnrichedSpanInfo";
import SpansToLinesArranger from "./SpanLines/SpansToLinesArranger";
import { transformTree, buildTree } from "./TreeTransformation";
import {
    AddSimplifiedBoundsToNodeTrasformer,
    AddColorConfigNodeTrasformer,
    AddReferenceToParentNodeTrasformer,
} from "./SpanInfoTransformers";

export type SpanLines = Array<{ items: Array<EnrichedSpanInfo> }>;

export function buildTreeFromSpanInfos(spans: Array<SpanInfo>): EnrichedSpanInfo {
    const tree = buildTree(spans)[0];
    const transformedTree: any = transformTree(tree, [
        new AddSimplifiedBoundsToNodeTrasformer(),
        new AddColorConfigNodeTrasformer(),
        new AddReferenceToParentNodeTrasformer(),
    ]);
    return transformedTree;
}

export function arrangeSpanInfos(spans: Array<SpanInfo>): SpanLines {
    const tree = buildTree(spans)[0];
    const arranger = new SpansToLinesArranger();
    const transformedTree: any = transformTree(tree, [
        new AddSimplifiedBoundsToNodeTrasformer(),
        new AddColorConfigNodeTrasformer(),
        new AddReferenceToParentNodeTrasformer(),
    ]);
    return arranger.arrange(transformedTree);
}

export function buildTreeAndArrangeSpanInfos(spans: Array<SpanInfo>): { tree: EnrichedSpanInfo, lines: SpanLines } {
    const tree = buildTree(spans)[0];
    const arranger = new SpansToLinesArranger();
    const transformedTree: any = transformTree(tree, [
        new AddSimplifiedBoundsToNodeTrasformer(),
        new AddColorConfigNodeTrasformer(),
        new AddReferenceToParentNodeTrasformer(),
    ]);
    const lines = arranger.arrange(transformedTree);
    return {
        tree: transformedTree,
        lines: lines,
    };
}
