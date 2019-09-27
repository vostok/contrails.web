import { ITreeNodeVisitor, VisitorResult } from "./ITreeNodeVisitor";

export type ChildrenGetter<TNode> = (node: TNode) => undefined | null | TNode[];

export function traverseTree<TNode>(
    node: TNode,
    childrenGetter: ChildrenGetter<TNode>,
    visitor: ITreeNodeVisitor<TNode>
): VisitorResult | undefined {
    let result = visitor.visitNodeBefore(node);
    if (result !== VisitorResult.StopTraversing && result !== VisitorResult.SkipChildren) {
        for (const child of childrenGetter(node) || []) {
            const childResult = traverseTree(child, childrenGetter, visitor);
            if (childResult === VisitorResult.StopTraversing) {
                result = VisitorResult.StopTraversing;
                break;
            }
        }
    }
    const afterResult = visitor.visitNodeAfter(node);
    if (afterResult === VisitorResult.StopTraversing) {
        return afterResult;
    }
    return result;
}
