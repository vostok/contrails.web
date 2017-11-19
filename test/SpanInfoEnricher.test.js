// @flow
import { expect } from "chai";
import moment from "moment";

import { buildTreeFromSpanInfos } from "../src/Domain/SpanInfoEnricher";

import Span from "./Utils/Span";

function relativeTimestamp(relativeValue: number): number {
    return moment("2013-02-08T12:00:00.0000000Z")
        .add(relativeValue, "ms")
        .valueOf();
}

describe("buildTreeFromSpanInfos", () => {
    it("должна строить EnrichedSpanInfo", () => {
        const spans = Span.create({ from: 0, to: 10 }).build();
        const tree = buildTreeFromSpanInfos(spans);

        expect(tree.from).to.eql(relativeTimestamp(0));
        expect(tree.to).to.eql(relativeTimestamp(10));
        expect(tree.colorConfig).to.eql(0);
        expect(tree.parent).to.not.exist;
    });

    it("должна строить EnrichedSpanInfo", () => {
        const spans = Span.create({ from: 0, to: 10 }).build();
        const tree = buildTreeFromSpanInfos(spans);

        expect(tree.from).to.eql(relativeTimestamp(0));
        expect(tree.to).to.eql(relativeTimestamp(10));
        expect(tree.colorConfig).to.eql(0);
        expect(tree.parent).to.not.exist;
    });
});
