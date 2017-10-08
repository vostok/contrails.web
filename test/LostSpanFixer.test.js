// @flow
import moment from "moment";
import { expect } from "chai";

import LostSpanFixer from "../src/Domain/TraceTree/LostSpanFixer";

type Span = {
    SpanId: string,
    ParentSpanId?: ?string,
    BeginTimestamp: string,
    EndTimestamp: string,
};

function timestamp(relativeValue: number): string {
    return moment("2013-02-08 12:00:00.000").add(relativeValue, "seconds").format();
}

function spanFactory(spanId: string, parentSpanId: string, beginTimestamp: string, endTimestamp: string): Span {
    return {
        SpanId: spanId,
        ParentSpanId: parentSpanId,
        BeginTimestamp: beginTimestamp,
        EndTimestamp: endTimestamp,
    };
}

describe("LostSpanFixer.fix", () => {
    it("простейший случай", () => {
        const fixer = new LostSpanFixer();
        const spans = [
            {
                SpanId: "1",
                ParentSpanId: null,
                BeginTimestamp: timestamp(0),
                EndTimestamp: timestamp(4),
            },
            {
                SpanId: "3",
                ParentSpanId: "2",
                BeginTimestamp: timestamp(1),
                EndTimestamp: timestamp(2),
            },
        ];
        const fixedSpans = fixer.fix(spans, spanFactory);
        const fakeSpan = fixedSpans.find(x => x.SpanId === "2");
        expect(fakeSpan).to.be.exist;
    });
    it("простейший случай", () => {
        const fixer = new LostSpanFixer();
        const spans = [
            {
                SpanId: "1",
                ParentSpanId: null,
                BeginTimestamp: timestamp(0),
                EndTimestamp: timestamp(4),
            },
            {
                SpanId: "2",
                ParentSpanId: "1",
                BeginTimestamp: timestamp(1),
                EndTimestamp: timestamp(3),
            },
            {
                SpanId: "4",
                ParentSpanId: "3",
                BeginTimestamp: timestamp(1),
                EndTimestamp: timestamp(2),
            },
        ];
        const fixedSpans = fixer.fix(spans, spanFactory);
        const fakeSpan = fixedSpans.find(x => x.SpanId === "3");
        expect(fakeSpan).to.be.exist;
        if (fakeSpan != null) {
            expect(fakeSpan.ParentSpanId).to.be.eql("2");
            expect(fakeSpan.BeginTimestamp).to.be.eql(timestamp(1));
            expect(fakeSpan.EndTimestamp).to.be.eql(timestamp(2));
        }
    });
});
