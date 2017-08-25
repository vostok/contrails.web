// @flow

export function reduceTree<TNode, TResult>(
    root: TNode,
    reducer: (childResults: Array<TResult>, node: TNode) => TResult,
    childrenGetter: TNode => ?Array<TNode>
): TResult {
    return reducer((childrenGetter(root) || []).map(child => reduceTree(child, reducer, childrenGetter)), root);
}

export function findNodeToReducer<TItem>(target: TItem): (Array<Array<TItem>>, TItem) => Array<TItem> {
    return function reducer(childResults: Array<Array<TItem>>, node: TItem): Array<TItem> {
        if (node === target) {
            return [node];
        }
        const results: Array<TItem> = childResults.reduce((x, y) => [...x, ...y], []);
        if (results.length > 0) {
            return [...results, node];
        }
        return [];
    };
}
