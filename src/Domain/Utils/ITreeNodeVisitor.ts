export enum VisitorResult {
    SkipChildren,
    StopTraversing,
}

export interface ITreeNodeVisitor<TNode> {
    visitNodeBefore(node: TNode): VisitorResult | undefined;
    visitNodeAfter(node: TNode): VisitorResult | undefined;
}
