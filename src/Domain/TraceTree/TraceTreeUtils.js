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

export default class TraceTreeUtils {
    static getParentSpan(root: SpanNode, span: SpanNode): ?SpanNode {
        const result = reduceTree(root, findParentSpanReducer(span), x => x.children);
        return result;
    }
}
