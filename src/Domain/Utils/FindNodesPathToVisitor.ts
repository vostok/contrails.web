import { ITreeNodeVisitor, VisitorResult } from "./ITreeNodeVisitor";
import { ChildrenGetter, traverseTree } from "./TraverseTree";

export class FindNodesPathToVisitor<T> implements ITreeNodeVisitor<T> {
    private readonly target: T;
    public result: T[] = [];

    public constructor(target: T) {
        this.target = target;
    }

    public visitNodeBefore(node: T): VisitorResult | undefined {
        if (node === this.target) {
            this.result.push(node);
            return VisitorResult.StopTraversing;
        }
        return undefined;
    }

    public visitNodeAfter(node: T): VisitorResult | undefined {
        if (this.result.length > 0 && node !== this.target) {
            this.result.push(node);
        }
        return undefined;
    }
}

export function findNodesPathTo<TNode>(root: TNode, target: TNode, childrenGetter: ChildrenGetter<TNode>): TNode[] {
    const visitor = new FindNodesPathToVisitor(target);
    traverseTree(root, childrenGetter, visitor);
    return visitor.result;
}
