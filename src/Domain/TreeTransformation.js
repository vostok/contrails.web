// @flow
import _ from "lodash";

import type { SpanInfo } from "./SpanInfo";

type TrasformerChain1<TIn1, TOut> = [ITreeTransformer<TIn1, TOut>];

type TrasformerChain2<TIn1, TIn2, TOut> = [ITreeTransformer<TIn1, TIn2>, ITreeTransformer<TIn2, TOut>];

type TrasformerChain3<TIn1, TIn2, TIn3, TOut> = [
    ITreeTransformer<TIn1, TIn2>,
    ITreeTransformer<TIn2, TIn3>,
    ITreeTransformer<TIn3, TOut>,
];

type TrasformerChain4<TIn1, TIn2, TIn3, TIn4, TOut> = [
    ITreeTransformer<TIn1, TIn2>,
    ITreeTransformer<TIn2, TIn3>,
    ITreeTransformer<TIn3, TIn4>,
    ITreeTransformer<TIn4, TOut>,
];

type TrasformerChain5<TIn1, TIn2, TIn3, TIn4, TIn5, TOut> = [
    ITreeTransformer<TIn1, TIn2>,
    ITreeTransformer<TIn2, TIn3>,
    ITreeTransformer<TIn3, TIn4>,
    ITreeTransformer<TIn4, TIn5>,
    ITreeTransformer<TIn5, TOut>,
];

type TrasformerChain<TIn1, TOut> =
    | TrasformerChain1<TIn1, TOut>
    | TrasformerChain2<TIn1, *, TOut>
    | TrasformerChain3<TIn1, *, *, TOut>
    | TrasformerChain4<TIn1, *, *, *, TOut>
    | TrasformerChain5<TIn1, *, *, *, *, TOut>;

export class TreeTransformerChain<TIn, TOut> {
    chain: TrasformerChain<TIn, TOut>;

    constructor(chain: TrasformerChain<TIn, TOut>) {
        this.chain = chain;
    }

    apply(value: Array<TIn>): Array<TOut> {
        // to add correct typeing need a tuple refinement
        // https://github.com/facebook/flow/pull/5048
        // https://github.com/facebook/flow/issues/4377
        // https://github.com/facebook/flow/issues/2389
        // @flow-disable-next-line
        return this.chain.reduce((result, transformer) => transformer.transform(result), value);
    }
}

export interface ITreeTransformer<TIn, TOut> {
    transform(roots: Array<TIn>): Array<TOut>;
}

export type TNode<T> = { children: Array<TNode<T>> } & T;

export class AddPropertiesToNodeTrasformer<TInfo, TOut: TInfo> implements ITreeTransformer<TNode<TInfo>, TNode<TOut>> {
    modifyNode(_node: TOut, _nodesPath: Array<TNode<TOut>>) {
        throw new Error("AbsractMethodNotImplementedError");
    }

    traverseTree(root: TNode<TOut>, nodesPath: Array<TNode<TOut>>) {
        this.modifyNode(root, nodesPath);
        nodesPath.push(root);
        for (const child of root.children) {
            this.traverseTree(child, nodesPath);
        }
        nodesPath.pop();
    }

    transform(roots: Array<TNode<TInfo>>): Array<TNode<TOut>> {
        const path = [];
        for (const root of roots) {
            this.traverseTree((root: any), path);
        }
        return (roots: any);
    }
}

export function transformTree<TIn, TOut>(
    tree: TNode<TIn>,
    trasformers: TrasformerChain<TNode<TIn>, TNode<TOut>>
): TNode<TOut> {
    const treeTransformer: TreeTransformerChain<TNode<TIn>, TNode<TOut>> = new TreeTransformerChain(trasformers);
    return treeTransformer.apply([tree])[0];
}

export function buildTree(nodes: SpanInfo[]): TNode<SpanInfo>[] {
    const modifiedNodes: TNode<SpanInfo>[] = (nodes: any);
    for (const node of modifiedNodes) {
        node.children = [];
    }
    const detachedNodes = [];
    const roots = nodes.filter(x => x.ParentSpanId == null);
    const groupByParent = _.groupBy(nodes.filter(x => x.ParentSpanId != null), x => x.ParentSpanId);
    const groupById = _.groupBy(nodes, x => x.SpanId);
    for (const spanId of Object.keys(groupByParent)) {
        if (groupById[spanId] != null) {
            groupById[spanId][0].children = groupByParent[spanId];
        } else {
            detachedNodes.push(...groupByParent[spanId]);
        }
    }
    return ([...roots, ...detachedNodes]: any);
}
