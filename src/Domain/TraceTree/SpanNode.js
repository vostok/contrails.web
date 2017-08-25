// @flow
import type { SpanInfo } from "../SpanInfo";

export type SpanNode = {
    type: "SingleSpan",
    from: number,
    to: number,
    serviceName: string,
    spanTitle: string,
    colorConfig: number,
    source: SpanInfo,
    children: Array<SpanNode>,
};

export default class SpanNodeUtils {
    static reduceTree<T>(root: SpanNode, reducer: (childResults: T[], node: SpanNode) => T): T {
        return reducer(root.children.map(child => this.reduceTree(child, reducer)), root);
    }
}
