// @flow
import { expect } from "chai";
import moment from "moment";

import Span from "./Utils/Span";

function relativeTimestamp(relativeValue: number): string {
    return moment("2013-02-08T12:00:00.0000000Z")
        .add(relativeValue, "ms")
        .format("YYYY-MM-DDTHH:mm:ss.SSSSSSSSZ");
}

describe("SpanBuilder", () => {
    it("должен создавать один спан", () => {
        const spans = Span.create({ from: 1, to: 2 }).build();
        expect(spans.length).to.eql(1);
        expect(spans[0].BeginTimestamp).to.eql(relativeTimestamp(1));
        expect(spans[0].EndTimestamp).to.eql(relativeTimestamp(2));
    });

    it("должен созадвать дочерные спаны", () => {
        const spans = Span.create({ from: 1, to: 2 })
            .children([Span.create({ from: 1, to: 2 }).children([Span.create({ from: 1, to: 2 })])])
            .build();
        expect(spans.length).to.eql(3);
        expect(spans[0].ParentSpanId).to.eql(null);
        expect(spans[1].ParentSpanId).to.eql(spans[0].SpanId);
        expect(spans[2].ParentSpanId).to.eql(spans[1].SpanId);
    });

    it("должен созадвать с учётом границ родетля", () => {
        const spans = Span.create({ from: 1, to: 5 })
            .children([Span.create({ left: 1, right: 1 }).children([Span.create({ left: 1, length: 2 })])])
            .build();
        expect(spans.length).to.eql(3);
        expect(spans[1].BeginTimestamp).to.eql(relativeTimestamp(2));
        expect(spans[1].EndTimestamp).to.eql(relativeTimestamp(4));

        expect(spans[2].BeginTimestamp).to.eql(relativeTimestamp(3));
        expect(spans[2].EndTimestamp).to.eql(relativeTimestamp(5));
    });
});
