// @flow
import moment from "moment";

import type { SpanInfo } from "./SpanInfo";
import { AddPropertiesToNodeTrasformer } from "./TreeTransformation";

export class AddSimplifiedBoundsToNodeTrasformer<T: SpanInfo> extends AddPropertiesToNodeTrasformer<
    T,
    T & { from: number, to: number }
> {
    modifyNode(item: T & { from: number, to: number }) {
        item.from = moment(item.BeginTimestamp).valueOf();
        item.to = moment(item.EndTimestamp).valueOf();
    }
}

export class AddColorConfigNodeTrasformer<T: SpanInfo> extends AddPropertiesToNodeTrasformer<
    T,
    T & { colorConfig: number }
> {
    modifyNode(item: T & { colorConfig: number }) {
        item.colorConfig = 0;
    }
}
