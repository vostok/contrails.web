// @flow
import { expect } from "chai";
import _ from "lodash";
import { newGuid } from "commons/guid";

import type { SpanInfo } from "../src/Domain/SpanInfo";

import Span from "./Utils/Span";

export type TNode<T> = { children: Array<TNode<T>> } & T;

function buildTree(nodes: SpanInfo[]): TNode<SpanInfo>[] {
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

describe("buildTree", () => {
    it("должен строить дерево из одного элемента", () => {
        const spans = Span.create({ from: 0, to: 10 }).build();
        const tree: TNode<SpanInfo>[] = buildTree(spans);
        expect(tree.length).to.eql(1);
    });

    it("должен строить дерево из двух элементов", () => {
        const spans = Span.create({ from: 0, to: 10 })
            .children([Span.create({ from: 0, to: 10 })])
            .build();
        const tree: TNode<SpanInfo>[] = buildTree(spans);
        expect(tree.length).to.eql(1);
        expect(tree[0].children.length).to.eql(1);
    });

    it("должен строить два дерева при потерянных спанах", () => {
        const spans = [
            ...Span.create({ from: 0, to: 10 })
                .children([Span.create({ from: 0, to: 10 })])
                .build(),
            ...Span.create({ from: 0, to: 10 })
                .parent(newGuid())
                .children([Span.create({ from: 0, to: 10 })])
                .build(),
        ];
        const tree: TNode<SpanInfo>[] = buildTree(spans);
        expect(tree.length).to.eql(2);
    });
});
