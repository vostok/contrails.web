// @flow
import { expect } from "chai";

import type { SpanInfo } from "../src/Domain/SpanInfo";
import { buildTree, transformTree } from "../src/Domain/TreeTransformation";
import SpansToLinesArranger from "../src/Domain/SpanLines/SpansToLinesArranger";
import { AddSimplifiedBoundsToNodeTrasformer } from "../src/Domain/SpanInfoTransformers";

import Span from "./Utils/Span";

function buildTreeWithBounds(spans: SpanInfo[]): * {
    const tree = buildTree(spans)[0];
    return transformTree(tree, [new AddSimplifiedBoundsToNodeTrasformer()]);
}

describe("SpansToLinesArranger.arrange", () => {
    it("должен располагать элементы друг под другом", () => {
        const arranger = new SpansToLinesArranger();
        const spans = Span.create({ from: 0, to: 2 })
            .children([Span.create({ from: 1, to: 2 })])
            .build();

        const spansByLines = arranger.arrange(buildTreeWithBounds(spans));

        expect(spansByLines[0].items[0].SpanId).to.eql(spans[0].SpanId);
        expect(spansByLines[1].items[0].SpanId).to.eql(spans[1].SpanId);
    });
});
