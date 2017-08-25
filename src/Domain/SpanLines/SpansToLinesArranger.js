// @flow
import type { SpanNode } from "../TraceTree/SpanNode";

export type SpanLineItem = {
    from: number,
    to: number,
    source: SpanNode,
};

export type SpanLines = Array<{ items: Array<SpanLineItem> }>;

export default class SpansToLinesArranger {
    arrange(rootNode: SpanNode): SpanLines {
        const result: SpanLines = [];
        return this.treeTraverse(
            rootNode,
            (result, { node }, depth) => {
                result[depth] = result[depth] || { items: [] };
                result[depth].items.push({
                    source: node,
                    from: node.from,
                    to: node.to,
                });
                return result;
            },
            result,
            x => x.children
        );
    }

    // eslint-disable-next-line max-params
    treeTraverse<T, TNode>(
        root: TNode,
        visitor: (T, { node: TNode, parent: ?TNode }, number) => T,
        init: T,
        childrenGetter: TNode => Array<TNode>
    ): T {
        if (root == null) {
            return init;
        }
        return this.treeTraverseInternal(null, root, visitor, init, 0, childrenGetter);
    }

    // eslint-disable-next-line max-params
    treeTraverseInternal<T, TNode>(
        parent: ?TNode,
        root: TNode,
        visitor: (T, { node: TNode, parent: ?TNode }, number) => T,
        init: T,
        currentDepth: number,
        childrenGetter: TNode => Array<TNode>
    ): T {
        let result = visitor(init, { node: root, parent: parent }, currentDepth);
        const children = childrenGetter(root);
        for (const child of children) {
            result = this.treeTraverseInternal(root, child, visitor, result, currentDepth + 1, childrenGetter);
        }
        return result;
    }
}
