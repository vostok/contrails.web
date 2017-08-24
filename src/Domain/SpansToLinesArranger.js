// @flow
import moment from "moment";

import type { SpanInfo } from "./SpanInfo";

export type SpanLineItem = {
    from: number,
    to: number,
    source: SpanInfo,
};

export type SpanLines = Array<{ items: Array<SpanLineItem> }>;

export default class SpansToLinesArranger {
    arrange(spans: SpanInfo[]): SpanLines {
        const result: SpanLines = [];
        return this.treeTraverse(
            spans,
            (result, { node }, depth) => {
                result[depth] = result[depth] || { items: [] };
                result[depth].items.push({
                    source: node,
                    from: moment(node.BeginTimestamp).valueOf(),
                    to: moment(node.EndTimestamp).valueOf(),
                });
                return result;
            },
            result
        );
    }

    treeTraverse<T>(spans: SpanInfo[], visitor: (T, { node: SpanInfo, parent: ?SpanInfo }, number) => T, init: T): T {
        const root = spans.find(x => x.ParentSpanId == null);
        if (root == null) {
            return init;
        }
        return this.treeTraverseInternal(root, spans, visitor, init, 0);
    }

    // eslint-disable-next-line max-params
    treeTraverseInternal<T>(
        root: SpanInfo,
        spans: SpanInfo[],
        visitor: (T, { node: SpanInfo, parent: ?SpanInfo }, number) => T,
        init: T,
        currentDepth: number
    ): T {
        let result = visitor(
            init,
            { node: root, parent: spans.find(x => x.SpanId === root.ParentSpanId) },
            currentDepth
        );
        const children = spans.filter(x => x.ParentSpanId === root.SpanId);
        for (const child of children) {
            result = this.treeTraverseInternal(child, spans, visitor, result, currentDepth + 1);
        }
        return result;
    }
}
