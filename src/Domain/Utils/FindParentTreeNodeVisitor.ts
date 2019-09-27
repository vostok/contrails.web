import { ITreeNodeVisitor, VisitorResult } from "./ITreeNodeVisitor";
import { ChildrenGetter, traverseTree } from "./TraverseTree";

export class FindParentTreeNodeVisitor<T> implements ITreeNodeVisitor<T> {
    private readonly nodeStack: T[] = [];
    private readonly childNode: T;
    public result?: T;

    public constructor(childNode: T) {
        this.childNode = childNode;
    }

    public visitNodeBefore(node: T): VisitorResult | undefined {
        if (node === this.childNode) {
            if (this.nodeStack.length > 0) {
                this.result = this.nodeStack[this.nodeStack.length - 1];
            }
            return VisitorResult.StopTraversing;
        }
        this.nodeStack.push(node);
        return undefined;
    }

    public visitNodeAfter(node: T): VisitorResult | undefined {
        this.nodeStack.pop();
        return undefined;
    }
}

export function findParentNode<TNode>(
    root: TNode,
    childNode: TNode,
    childrenGetter: ChildrenGetter<TNode>
): TNode | undefined {
    const visitor = new FindParentTreeNodeVisitor(childNode);
    traverseTree(root, childrenGetter, visitor);
    return visitor.result;
}
