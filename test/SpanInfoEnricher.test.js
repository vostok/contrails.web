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

    describe("должен исправлять потерянные спаны,", () => {
        it("в простом случае", () => {
            const spans = [
                ...Span.create({ from: 0, to: 10 }).build(),
                ...Span.create({ from: 1, to: 9 })
                    .parent("UnknownParentSpanId")
                    .build(),
            ];
            const tree = buildTreeFromSpanInfos(spans);

            expect(tree.parent).to.not.exist;
            expect(tree.children.length).to.eql(1);
        });

        it("если нет пересечений", () => {
            const spans = [
                ...Span.create({ from: 0, to: 10 }).build(),
                ...Span.create({ from: 12, to: 13 })
                    .parent("UnknownParentSpanId")
                    .build(),
            ];
            const tree = buildTreeFromSpanInfos(spans);

            expect(tree.parent).to.not.exist;
            expect(tree.children.length).to.eql(1);
            expect(tree.children[0].children.length).to.eql(1);
        });

        it("простейший случай с тремя спанами", () => {
            const spans = [
                ...Span.create({ from: 0, to: 4 })
                    .children([Span.create({ from: 1, to: 3 })])
                    .build(),
                ...Span.create({ from: 1, to: 2 })
                    .parent("UnknownParentSpanId")
                    .build(),
            ];
            const tree = buildTreeFromSpanInfos(spans);
            expect(tree.parent).to.not.exist;
            expect(tree.children[0].children[0].children.length).to.eql(1);
        });

        it("добавление корневого спана #1", () => {
            const spans = [
                ...Span.create({ from: 1, to: 2 })
                    .parent("UnknownParentSpanId")
                    .build(),
            ];
            const tree = buildTreeFromSpanInfos(spans);
            expect(tree.parent).to.not.exist;
            expect(tree.children.length).to.eql(1);
        });

        it("нет ни одного пересекающегося спана", () => {
            const spans = [
                ...Span.create({ from: 0, to: 10 })
                    .children([Span.create({ from: 1, to: 9 }).children([Span.create({ from: 1, to: 2 })])])
                    .build(),
                ...Span.create({ from: 12, to: 13 })
                    .parent("UnknownParentSpanId")
                    .build(),
            ];
            const tree = buildTreeFromSpanInfos(spans);

            expect(tree.parent).to.not.exist;
            expect(tree.children.length).to.eql(2);
        });

        it("несколько детей у потерянного спана", () => {
            const spans = [
                ...Span.create({ from: 0, to: 4 })
                    .children([Span.create({ from: 1, to: 3 })])
                    .build(),
                ...Span.create({ from: 1, to: 2 })
                    .parent("UnknownParentSpanId")
                    .children([Span.create({ from: 1, to: 2 })])
                    .build(),
            ];
            const tree = buildTreeFromSpanInfos(spans);
            expect(tree.parent).to.not.exist;
            expect(tree.children[0].children[0].children.length).to.eql(1);
            expect(tree.children[0].children[0].children[0].children.length).to.eql(1);
        });
    });
});
