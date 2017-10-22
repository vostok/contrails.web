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

export function filterNodesBy<TItem>(condition: TItem => boolean, setChildren): (Array<?TItem>, TItem) => ?TItem {
    return function reducer(childResults: Array<?TItem>, node: TItem): ?TItem {
        const notEmptyChildren = childResults.filter(x => x != null);
        if (notEmptyChildren.length === 0) {
            return condition(node) ? node : null;
        }
        return setChildren(node, notEmptyChildren);
    };
}

export function isChildReducer<TItem>(target: TItem): (Array<boolean>, TItem) => boolean {
    return function reducer(childResults: Array<boolean>, node: TItem): boolean {
        if (node === target) {
            return true;
        }
        return childResults.some(x => x);
    };
}

function flatten<T>(memo: Array<T>, item: Array<T>): Array<T> {
    for (let i = 0; i < item.length; i++) {
        memo.push(item[i]);
    }
    return memo;
}
