// @flow
import { expect } from "chai";
import moment from "moment";

import type { SpanInfo } from "../src/Domain/SpanInfo";
import TraceTreeBuilder from "../src/Domain/TraceTree/TraceTreeBuilder";
import { LogsearchDataExtractor } from "../src/Domain/IDataExtractor";

function timestamp(relativeValue: number): string {
    return moment("2013-02-08 12:00:00.000")
        .add(relativeValue, "seconds")
        .format();
}

function timestampAsNumber(relativeValue: number): number {
    return moment("2013-02-08 12:00:00.000")
        .add(relativeValue, "seconds")
        .valueOf();
}
// eslint-disable-next-line max-params
function createSpan(id: string, parentId: ?string, from: number, to: number, isClientSpan: boolean): SpanInfo {
    return {
        BeginTimestamp: timestamp(from),
        EndTimestamp: timestamp(to),
        TraceId: "1",
        SpanId: id,
        ParentSpanId: parentId,
        OperationName: "Name",
        Annotations: {
            IsClientSpan: isClientSpan,
        },
    };
}

function createTraceTreeBuilder(): TraceTreeBuilder {
    return new TraceTreeBuilder(new LogsearchDataExtractor());
}

describe("TraceTreeBuilder", () => {
    it("должен строить RemoteCallSpan", () => {
        const builder = createTraceTreeBuilder();
        const tree = builder.buildTraceTree([
            createSpan("1", null, 10, 100, true),
            createSpan("2", "1", 12, 99, false),
        ]);

        expect(tree.type).to.eql("RemoteCallSpan");
        if (tree.type === "RemoteCallSpan") {
            expect(tree.serverRange).to.eql({ from: timestampAsNumber(12), to: timestampAsNumber(99) });
            expect(tree.children.length).to.eql(0);
        }
    });

    it("должен строить RemoteCallSpan со сдвигом", () => {
        const builder = createTraceTreeBuilder();
        const tree = builder.buildTraceTree([
            createSpan("1", null, 10, 100, true),
            createSpan("2", "1", 12, 101, false),
        ]);

        expect(tree.type).to.eql("RemoteCallSpan");
        if (tree.type === "RemoteCallSpan") {
            expect(tree.serverRange).to.eql({ from: timestampAsNumber(11), to: timestampAsNumber(100) });
            expect(tree.children.length).to.eql(0);
        }
    });
});
