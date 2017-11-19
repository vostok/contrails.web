// @flow
import type { SpanInfo } from "./SpanInfo";
import type { EnrichedSpanInfo } from "./EnrichedSpanInfo";
import SpansToLinesArranger2 from "./SpanLines/SpansToLinesArranger2";
import { transformTree } from "./TreeTransformation";
import {
    AddSimplifiedBoundsToNodeTrasformer,
    AddColorConfigNodeTrasformer,
    AddReferenceToParentNodeTrasformer,
} from "./SpanInfoTransformers";

export type SpanLines = Array<{ items: Array<EnrichedSpanInfo> }>;

export function buildTree(spans: Array<SpanInfo>): EnrichedSpanInfo {
    const tree = buildTree(spans)[0];
    const transformedTree = transformTree(tree, [
        new AddSimplifiedBoundsToNodeTrasformer(),
        new AddColorConfigNodeTrasformer(),
        new AddReferenceToParentNodeTrasformer(),
    ])[0];
    return transformedTree[0];
}

export function arrangeSpanInfos(spans: Array<SpanInfo>): SpanLines {
    const tree = buildTree(spans)[0];
    const arranger = new SpansToLinesArranger2();
    const transformedTree = transformTree(tree, [
        new AddSimplifiedBoundsToNodeTrasformer(),
        new AddColorConfigNodeTrasformer(),
        new AddReferenceToParentNodeTrasformer(),
    ])[0];
    return arranger.arrange(transformedTree);
}

export function buildTreeAndArrangeSpanInfos(spans: Array<SpanInfo>): { tree: EnrichedSpanInfo, lines: SpanLines } {
    const tree = buildTree(spans)[0];
    const arranger = new SpansToLinesArranger2();
    const transformedTree = transformTree(tree, [
        new AddSimplifiedBoundsToNodeTrasformer(),
        new AddColorConfigNodeTrasformer(),
        new AddReferenceToParentNodeTrasformer(),
    ])[0];
    const lines = arranger.arrange(transformedTree);
    return {
        tree: transformedTree,
        lines: lines,
    };
}
