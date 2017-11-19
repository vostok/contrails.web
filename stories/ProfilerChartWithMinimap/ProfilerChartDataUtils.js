// @flow
import moment from "moment";

import type { TraceInfo } from "../../src/Domain/TraceInfo";
import type { SpanInfo } from "../../src/Domain/SpanInfo";
import { buildTree, transformTree } from "../../src/Domain/TreeTransformation";
import SpansToLinesArranger2 from "../../src/Domain/SpanLines/SpansToLinesArranger2";
import {
    AddSimplifiedBoundsToNodeTrasformer,
    AddColorConfigNodeTrasformer,
} from "../../src/Domain/SpanInfoTransformers";

function min(x: number, y: number): number {
    return Math.min(x, y);
}

function max(x: number, y: number): number {
    return Math.max(x, y);
}

function buildTreeLines(spans: SpanInfo[]): * {
    const tree = buildTree(spans)[0];
    const arranger = new SpansToLinesArranger2();
    const transformedTree = transformTree(tree, [
        new AddSimplifiedBoundsToNodeTrasformer(),
        new AddColorConfigNodeTrasformer(),
    ]);
    return arranger.arrange(transformedTree);
}

export function buildDataFromSpans(spans: SpanInfo[]): * {
    return {
        from: spans
            .map(x => x.BeginTimestamp)
            .map(x => moment(x))
            .map(x => x.valueOf())
            .reduce(min),
        to: spans
            .map(x => x.EndTimestamp)
            .map(x => moment(x))
            .map(x => x.valueOf())
            .reduce(max),
        data: { lines: buildTreeLines(spans) },
    };
}

export function buildPropsFromResponse(response: TraceInfo[]): * {
    const spans = response[0].Spans;
    return {
        from: spans
            .map(x => x.BeginTimestamp)
            .map(x => moment(x))
            .map(x => x.valueOf())
            .reduce(min),
        to: spans
            .map(x => x.EndTimestamp)
            .map(x => moment(x))
            .map(x => x.valueOf())
            .reduce(max),
        data: { lines: buildTreeLines(spans) },
    };
}
