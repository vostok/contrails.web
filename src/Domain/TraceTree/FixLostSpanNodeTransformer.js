// @flow
import _ from "lodash";
import { InvalidProgramStateError } from "commons/Errors";

import type { ITreeTransformer } from "../TreeTransformation";

type SpanRange = {
    from: number,
    to: number,
};

type SpanBase<T> = {
    SpanId: string,
    ParentSpanId?: ?string,
    from: number,
    to: number,
    BeginTimestamp: string,
    EndTimestamp: string,
    children: ?Array<SpanBase<T>>,
} & T;

export type SpanFactory<T> = (spanId: string, parentSpanId: ?string, beginTimestamp: string, endTimestamp: string) => T;

export default class FixLostSpanNodeTransformer<T> implements ITreeTransformer<SpanBase<T>, SpanBase<T>> {
    spanFactory: SpanFactory<SpanBase<T>>;
    fakeSpanIncrement: number;

    constructor(spanFactory: SpanFactory<SpanBase<T>>) {
        this.spanFactory = spanFactory;
        this.fakeSpanIncrement = 0;
    }

    transform(roots: Array<SpanBase<T>>): Array<SpanBase<T>> {
        let allNodes = roots;
        let root = allNodes.find(x => x.ParentSpanId == null);
        if (root == null) {
            root = this.createRootSpan(allNodes);
            allNodes = [root, ...allNodes];
        }
        const detachedRoots = allNodes.filter(x => x.ParentSpanId != null);
        if (detachedRoots.length === 0) {
            return allNodes;
        }
        for (const detachedRoot of detachedRoots) {
            const parent = this.findMostSuitableParent(detachedRoot, allNodes);
            if (detachedRoot.ParentSpanId == null) {
                throw new InvalidProgramStateError();
            }
            if (parent != null) {
                const fakeSpan = this.spanFactory(
                    detachedRoot.ParentSpanId,
                    parent.SpanId,
                    detachedRoot.BeginTimestamp,
                    detachedRoot.EndTimestamp
                );
                fakeSpan.from = detachedRoot.from;
                fakeSpan.to = detachedRoot.to;
                fakeSpan.children = [detachedRoot];
                parent.children = parent.children || [];
                parent.children.push(fakeSpan);
            }
        }
        return [root];
    }

    createRootSpan(nodes: Array<SpanBase<T>>): SpanBase<T> {
        const allNodes = this.flattenNodes(nodes);
        const mostLeftNode = _.minBy(allNodes, x => x.from);
        const mostRightNode = _.minBy(allNodes, x => x.from);
        const result = this.spanFactory(
            "fake-root-id",
            null,
            mostLeftNode.BeginTimestamp,
            mostRightNode.BeginTimestamp
        );
        result.from = mostLeftNode.from;
        result.to = mostRightNode.to;
        result.children = [];
        return result;
    }

    findMostSuitableParent(node: SpanBase<T>, nodes: Array<SpanBase<T>>): SpanBase<T> {
        const flattenedNodes = this.flattenNodes(nodes.filter(x => x !== node));
        const intersectedNodes = flattenedNodes.filter(x => this.getSpanIntersectionLength(x, node) > 0);
        if (intersectedNodes.length === 0) {
            const root = nodes.find(x => x.ParentSpanId == null);
            if (root == null) {
                throw new InvalidProgramStateError();
            }
            return root;
        }
        const result = _.orderBy(
            intersectedNodes,
            [x => this.getSpanIntersectionLength(x, node), x => x.to - x.from],
            ["desc", "asc"]
        )[0];
        return result;
    }

    getSpanIntersectionLength(left: SpanRange, right: SpanRange): number {
        const intersection = this.getSpanIntersection(left, right);
        if (intersection == null) {
            return 0;
        }
        return this.getSpanLength(intersection);
    }

    getSpanIntersection(left: SpanRange, right: SpanRange): ?SpanRange {
        const leftFrom = left.from;
        const leftTo = left.to;
        const rightFrom = right.from;
        const rightTo = right.to;

        if (leftTo <= rightFrom) {
            return null;
        }
        if (leftFrom >= rightTo) {
            return null;
        }
        if (leftFrom <= rightFrom && rightFrom < leftTo && leftTo <= rightTo) {
            return { from: right.from, to: left.to };
        }
        if (leftFrom <= rightFrom && rightFrom < leftTo && rightTo <= leftTo) {
            return { from: right.from, to: right.to };
        }
        if (rightFrom <= leftFrom && leftFrom < rightTo && rightTo <= leftTo) {
            return { from: left.from, to: right.to };
        }
        if (rightFrom <= leftFrom && leftFrom < rightTo && leftTo <= rightTo) {
            return { from: left.from, to: left.to };
        }
        return null;
    }

    getSpanLength(span: SpanRange): number {
        return span.to - span.from;
    }

    flattenNodes(nodes: Array<SpanBase<T>>): Array<SpanBase<T>> {
        const result = [];
        this.flattenNodesInternal(result, nodes);
        return result;
    }

    flattenNodesInternal(result: Array<SpanBase<T>>, nodes: Array<SpanBase<T>>) {
        for (const node of nodes) {
            result.push(node);
        }
        for (const node of nodes) {
            if (node.children != null) {
                this.flattenNodesInternal(result, node.children);
            }
        }
    }
}
