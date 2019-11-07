import { SpanNode } from "../TraceTree/SpanNode";

export interface SpanLineItem {
    from: number;
    to: number;
    source: SpanNode;
}

export type SpanLines = Array<{ items: SpanLineItem[] }>;

export class SpansToLinesArranger {
    public arrange(rootNode: SpanNode): SpanLines {
        const totalResult: SpanLines = [];
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
            totalResult,
            x => x.children
        );
    }

    public treeTraverse<T, TNode>(
        root: TNode,
        visitor: (item: T, context: { node: TNode; parent: undefined | TNode }, x: number) => T,
        init: T,
        childrenGetter: (node: TNode) => TNode[]
    ): T {
        if (root == undefined) {
            return init;
        }
        return this.treeTraverseInternal(undefined, root, visitor, init, 0, childrenGetter);
    }

    public treeTraverseInternal<T, TNode>(
        parent: undefined | TNode,
        root: TNode,
        visitor: (item: T, context: { node: TNode; parent: undefined | TNode }, x: number) => T,
        init: T,
        currentDepth: number,
        childrenGetter: (node: TNode) => TNode[]
    ): T {
        let result = visitor(init, { node: root, parent: parent }, currentDepth);
        const children = childrenGetter(root);
        for (const child of children) {
            result = this.treeTraverseInternal(root, child, visitor, result, currentDepth + 1, childrenGetter);
        }
        return result;
    }
}
