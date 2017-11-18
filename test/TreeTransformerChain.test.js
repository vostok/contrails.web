// @flow
import { expect } from "chai";

import type { SpanInfo } from "../src/Domain/SpanInfo";
import { buildTree, TreeTransformerChain, AddPropertiesToNodeTrasformer } from "../src/Domain/TreeTransformation";

import Span from "./Utils/Span";

export type TNode<T> = { children: Array<TNode<T>> } & T;

class AddNameTransformer<T: SpanInfo> extends AddPropertiesToNodeTrasformer<T, T & { name: string }> {
    modifyNode(item: T & { name: string }) {
        item.name = "name";
    }
}

class AddValueTransformer<T: SpanInfo> extends AddPropertiesToNodeTrasformer<T, T & { value: string }> {
    modifyNode(item: T & { value: string }) {
        item.value = "value";
    }
}

describe("TreeTransformerChain", () => {
    it("должен применять несколько трансформеров", () => {
        const spans = Span.create({ from: 0, to: 10 }).build();
        const tree: TNode<SpanInfo>[] = buildTree(spans);
        const treeTransformer: TreeTransformerChain<
            TNode<SpanInfo>,
            TNode<SpanInfo & { name: string } & { value: string }>
        > = new TreeTransformerChain([new AddNameTransformer(), new AddValueTransformer()]);

        const newTree = treeTransformer.apply(tree);

        expect(newTree[0].name).to.eql("name");
        expect(newTree[0].value).to.eql("value");
    });
});
