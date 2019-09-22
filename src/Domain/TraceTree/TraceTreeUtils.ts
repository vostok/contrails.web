import { TimeRange } from "../TimeRange";
import { reduceTree, TreeReducer } from "../Utils/TreeTraverseUtils";

import { SpanNode } from "./SpanNode";

function findParentSpanReducer(target: SpanNode): TreeReducer<undefined | SpanNode, SpanNode> {
    return (childResults, current) => {
        const childResult = childResults.find(x => x != undefined);
        if (childResult != undefined) {
            return childResult;
        }
        if (current.children.includes(target)) {
            return current;
        }
        return undefined;
    };
}

export class TraceTreeUtils {
    public static getParentSpan(root: SpanNode, span: SpanNode): undefined | SpanNode {
        const result = reduceTree(root, findParentSpanReducer(span), x => x.children);
        return result;
    }

    public static getSpanIntersectionLength(left: TimeRange, right: TimeRange): number {
        const intersection = this.getSpanIntersection(left, right);
        if (intersection == undefined) {
            return 0;
        }
        return intersection.to - intersection.from;
    }

    public static getSpanIntersection(left: TimeRange, right: TimeRange): undefined | TimeRange {
        if (left.to <= right.from) {
            return undefined;
        }
        if (left.from >= right.to) {
            return undefined;
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
        return undefined;
    }

    public static getSpanNodeSelfTime(spanNode: SpanNode): number {
        // TODO можно сделать за n * log n, сейчас n^2
        let result = spanNode.to - spanNode.from;
        for (let i = 0; i < spanNode.children.length; i++) {
            const intersectedWithParent = this.getSpanIntersection(spanNode, spanNode.children[i]);
            if (intersectedWithParent == undefined) {
                continue;
            }
            let childLength = intersectedWithParent.to - intersectedWithParent.from;
            for (let j = i + 1; j < spanNode.children.length; j++) {
                const nextIntersectedWithParent = this.getSpanIntersection(spanNode, spanNode.children[j]);
                if (nextIntersectedWithParent == undefined) {
                    continue;
                }
                childLength -= this.getSpanIntersectionLength(intersectedWithParent, nextIntersectedWithParent);
            }
            result -= childLength;
        }
        return result;
    }
}
