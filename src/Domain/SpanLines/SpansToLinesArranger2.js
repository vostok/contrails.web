// @flow
import type { TNode } from "../TreeTransformation";

export type SpanLineItem = {
    from: number,
    to: number,
};

export type SpanLines<T> = Array<{ items: Array<T> }>;

export default class SpansToLinesArranger<T: SpanLineItem> {
    arrange(rootNode: TNode<T>): SpanLines<T> {
        const result: SpanLines<T> = [];
        return this.treeTraverse(
            rootNode,
            (result, { node }, depth) => {
                result[depth] = result[depth] || { items: [] };
                result[depth].items.push(node);
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
