/* tslint:disable:no-unused-expression Для тестов можно */
import { expect } from "chai";
import moment from "moment";

import { LostSpanFixer } from "../src/Domain/TraceTree/LostSpanFixer";

interface Span {
    SpanId: string;
    ParentSpanId?: undefined | string;
    BeginTimestamp: string;
    EndTimestamp: string;
}

function timestamp(relativeValue: number): string {
    return moment("2013-02-08 12:00:00.000").add(relativeValue, "seconds").format();
}

function spanFactory(
    spanId: string,
    parentSpanId: undefined | string,
    beginTimestamp: string,
    endTimestamp: string
): Span {
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
                ParentSpanId: undefined,
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
    it("простейший случай непересекающихся спанов", () => {
        const fixer = new LostSpanFixer();
        const spans = [
            {
                SpanId: "1",
                ParentSpanId: undefined,
                BeginTimestamp: timestamp(0),
                EndTimestamp: timestamp(4),
            },
            {
                SpanId: "3",
                ParentSpanId: "2",
                BeginTimestamp: timestamp(1),
                EndTimestamp: timestamp(5),
            },
        ];
        const fixedSpans = fixer.fix(spans, spanFactory);
        const fakeSpan = fixedSpans.find(x => x.SpanId === "2");
        expect(fakeSpan).to.be.exist;
        if (fakeSpan != undefined) {
            expect(fakeSpan.ParentSpanId).to.eql("1");
            expect(fakeSpan.BeginTimestamp).to.eql(timestamp(1));
            expect(fakeSpan.EndTimestamp).to.eql(timestamp(5));
        }
    });
    it("простейший случай с тремя спанами", () => {
        const fixer = new LostSpanFixer();
        const spans = [
            {
                SpanId: "1",
                ParentSpanId: undefined,
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
        if (fakeSpan != undefined) {
            expect(fakeSpan.ParentSpanId).to.be.eql("2");
            expect(fakeSpan.BeginTimestamp).to.be.eql(timestamp(1));
            expect(fakeSpan.EndTimestamp).to.be.eql(timestamp(2));
        }
    });
    it("добавление корневого спана #1", () => {
        const fixer = new LostSpanFixer();
        const spans = [
            {
                SpanId: "2",
                ParentSpanId: "1",
                BeginTimestamp: timestamp(1),
                EndTimestamp: timestamp(3),
            },
        ];
        const fixedSpans = fixer.fix(spans, spanFactory);
        const fakeSpan = fixedSpans.find(x => x.SpanId === "1");
        expect(fakeSpan).to.be.exist;
    });
    it("нет ни одного пересекающегося спана", () => {
        const fixer = new LostSpanFixer();
        const spans = [
            {
                SpanId: "1",
                ParentSpanId: undefined,
                BeginTimestamp: timestamp(0),
                EndTimestamp: timestamp(4),
            },
            {
                SpanId: "2",
                ParentSpanId: undefined,
                BeginTimestamp: timestamp(4),
                EndTimestamp: timestamp(8),
            },
            {
                SpanId: "4",
                ParentSpanId: "3",
                BeginTimestamp: timestamp(10),
                EndTimestamp: timestamp(11),
            },
            {
                SpanId: "5",
                ParentSpanId: "4",
                BeginTimestamp: timestamp(10),
                EndTimestamp: timestamp(11),
            },
        ];
        const fixedSpans = fixer.fix(spans, spanFactory);
        const fakeSpan = fixedSpans.find(x => x.SpanId === "3");
        expect(fakeSpan).to.be.exist;
        if (fakeSpan != undefined) {
            expect(fakeSpan.ParentSpanId).to.eql("2");
        }
    });
    it("несколько детей у потерянного спана", () => {
        const fixer = new LostSpanFixer();
        const spans = [
            {
                SpanId: "1",
                ParentSpanId: undefined,
                BeginTimestamp: timestamp(0),
                EndTimestamp: timestamp(10),
            },
            {
                SpanId: "4",
                ParentSpanId: "3",
                BeginTimestamp: timestamp(1),
                EndTimestamp: timestamp(2),
            },
            {
                SpanId: "5",
                ParentSpanId: "3",
                BeginTimestamp: timestamp(3),
                EndTimestamp: timestamp(4),
            },
        ];
        const fixedSpans = fixer.fix(spans, spanFactory);
        const fakeSpan = fixedSpans.find(x => x.SpanId === "3");
        expect(fakeSpan).to.be.exist;
        if (fakeSpan != undefined) {
            expect(fakeSpan.BeginTimestamp).to.be.eql(timestamp(1));
            expect(fakeSpan.EndTimestamp).to.be.eql(timestamp(4));
        }
    });
});
