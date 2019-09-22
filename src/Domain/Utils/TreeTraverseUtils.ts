export type TreeReducer<TResult, TNode> = (items: TResult[], node: TNode) => TResult;

export function reduceTree<TNode, TResult>(
    root: TNode,
    reducer: TreeReducer<TResult, TNode>,
    childrenGetter: (node: TNode) => undefined | null | TNode[]
): TResult {
    return reducer((childrenGetter(root) || []).map(child => reduceTree(child, reducer, childrenGetter)), root);
}

export function findNodeToReducer<TItem>(target: TItem): (result: TItem[][], item: TItem) => TItem[] {
    return function reducer(childResults: TItem[][], node: TItem): TItem[] {
        if (node === target) {
            return [node];
        }
        const results: TItem[] = childResults.reduce(flatten, []);
        if (results.length > 0) {
            results.push(node);
        }
        return results;
    };
}

export function isChildReducer<TItem>(target: TItem): (x: boolean[], y: TItem) => boolean {
    return function reducer(childResults: boolean[], node: TItem): boolean {
        if (node === target) {
            return true;
        }
        return childResults.some(x => x);
    };
}

function flatten<T>(memo: T[], items: T[]): T[] {
    for (const item of items) {
        memo.push(item);
    }
    return memo;
}
