// @flow
import { reduceTree } from "../Utils/TreeTraverseUtils";
import type { TreeReducer } from "../Utils/TreeTraverseUtils";

import type { SpanNode } from "./SpanNode";

function findParentSpanReducer(target: SpanNode): TreeReducer<?SpanNode, SpanNode> {
    return (childResults, current) => {
        const childResult = childResults.find(x => x != null);
        if (childResult != null) {
            return childResult;
        }
        if (current.children.includes(target)) {
            return current;
        }
        return null;
    };
}

type Range = {
    from: number,
    to: number,
};

export default class TraceTreeUtils {
    static getParentSpan(root: SpanNode, span: SpanNode): ?SpanNode {
        const result = reduceTree(root, findParentSpanReducer(span), x => x.children);
        return result;
    }

    static getSpanIntersectionLength(left: Range, right: Range): number {
        const intersection = this.getSpanIntersection(left, right);
        if (intersection == null) {
            return 0;
        }
        return intersection.to - intersection.from;
    }

    static getSpanIntersection(left: Range, right: Range): ?Range {
        if (left.to <= right.from) {
            return null;
        }
        if (left.from >= right.to) {
            return null;
        }
        if (left.from <= right.from && right.from < left.to && left.to <= right.to) {
            return { from: right.from, to: left.to };
        }
        if (left.from <= right.from && right.from < left.to && right.to <= left.to) {
            return { from: right.from, to: right.to };
        }
        if (right.from <= left.from && left.from < right.to && right.to <= left.to) {
            return { from: left.from, to: right.to };
        }
        if (right.from <= left.from && left.from < right.to && left.to <= right.to) {
            return { from: left.from, to: left.to };
        }
        return null;
    }

    static getSpanNodeSelfTime(spanNode: SpanNode): number {
        // TODO можно сделать за n * log n, сейчас n^2
        let result = spanNode.to - spanNode.from;
        for (let i = 0; i < spanNode.children.length; i++) {
            const intersectedWithParent = this.getSpanIntersection(spanNode, spanNode.children[i]);
            if (intersectedWithParent == null) {
                continue;
            }
            let childLength = intersectedWithParent.to - intersectedWithParent.from;
            for (let j = i + 1; j < spanNode.children.length; j++) {
                const nextIntersectedWithParent = this.getSpanIntersection(spanNode, spanNode.children[j]);
                if (nextIntersectedWithParent == null) {
                    continue;
                }
                childLength -= this.getSpanIntersectionLength(intersectedWithParent, nextIntersectedWithParent);
            }
            result -= childLength;
        }
        return result;
    }
}
