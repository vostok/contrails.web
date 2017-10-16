// @flow

export type TreeReducer<TResult, TNode> = (Array<TResult>, TNode) => TResult;

export function reduceTree<TNode, TResult>(
    root: TNode,
    reducer: TreeReducer<TResult, TNode>,
    childrenGetter: TNode => ?Array<TNode>
): TResult {
    return reducer((childrenGetter(root) || []).map(child => reduceTree(child, reducer, childrenGetter)), root);
}

export function findNodeToReducer<TItem>(target: TItem): (Array<Array<TItem>>, TItem) => Array<TItem> {
    return function reducer(childResults: Array<Array<TItem>>, node: TItem): Array<TItem> {
        if (node === target) {
            return [node];
        }
        const results: Array<TItem> = childResults.reduce(flatten, []);
        if (results.length > 0) {
            results.push(node);
        }
        return results;
    };
}

function flatten<T>(memo: Array<T>, item: Array<T>): Array<T> {
    for (let i = 0; i < item.length; i++) {
        memo.push(item[i]);
    }
    return memo;
}
