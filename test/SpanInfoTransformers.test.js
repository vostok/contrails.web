// @flow
import { expect } from "chai";
import moment from "moment";

import type { SpanInfo } from "../src/Domain/SpanInfo";
// import type { EnrichedSpanInfo } from "../src/Domain/EnrichedSpanInfo";
import { buildTree, TreeTransformerChain, type TNode } from "../src/Domain/TreeTransformation";
import {
    AddSimplifiedBoundsToNodeTrasformer,
    AddColorConfigNodeTrasformer,
    AddReferenceToParentNodeTrasformer,
} from "../src/Domain/SpanInfoTransformers";

import Span from "./Utils/Span";

function relativeTimestamp(relativeValue: number): number {
    return moment("2013-02-08T12:00:00.0000000Z")
        .add(relativeValue, "ms")
        .valueOf();
}

describe("SpanInfoTransformers", () => {
    it("должна строить EnrichedSpanInfo", () => {
        const spans = Span.create({ from: 0, to: 10 }).build();
        const tree: TNode<SpanInfo>[] = buildTree(spans);
        const treeTransformer = new TreeTransformerChain([
            new AddSimplifiedBoundsToNodeTrasformer(),
            new AddColorConfigNodeTrasformer(),
            new AddReferenceToParentNodeTrasformer(),
        ]);

        const newTree = treeTransformer.apply(tree);

        expect(newTree[0].from).to.eql(relativeTimestamp(0));
        expect(newTree[0].to).to.eql(relativeTimestamp(10));
        expect(newTree[0].colorConfig).to.eql(0);
        expect(newTree[0].parent).to.not.exist;
    });
});
