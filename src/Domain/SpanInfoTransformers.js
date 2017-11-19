// @flow
import moment from "moment";

import type { SpanInfo } from "./SpanInfo";
import { AddPropertiesToNodeTrasformer, type TNode } from "./TreeTransformation";

export class AddSimplifiedBoundsToNodeTrasformer<T: SpanInfo> extends AddPropertiesToNodeTrasformer<
    T,
    { from: number, to: number } & T
> {
    modifyNode(item: { from: number, to: number } & T) {
        item.from = moment(item.BeginTimestamp).valueOf();
        item.to = moment(item.EndTimestamp).valueOf();
    }
}

export class AddColorConfigNodeTrasformer<T: SpanInfo> extends AddPropertiesToNodeTrasformer<
    T,
    { colorConfig: number } & T
> {
    modifyNode(item: { colorConfig: number } & T) {
        item.colorConfig = 0;
    }
}

type TWithParent<T> = { parent: ?TWithParent<T> } & T;

export class AddReferenceToParentNodeTrasformer<T: SpanInfo> extends AddPropertiesToNodeTrasformer<T, TWithParent<T>> {
    modifyNode(item: { parent: T } & T, nodesPath: Array<TNode<TWithParent<T>>>) {
        if (nodesPath.length != null) {
            item.parent = nodesPath[nodesPath.length - 1];
        }
    }
}
