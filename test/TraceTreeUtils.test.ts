import { expect } from "chai";

import { SpanNode } from "../src/Domain/TraceTree/SpanNode";
import { TraceTreeUtils } from "../src/Domain/TraceTree/TraceTreeUtils";

function createSpan(from: number, to: number, children?: SpanNode[]): SpanNode {
    return {
        type: "SingleSpan",
        from: from,
        to: to,
        status: 0,
        serviceName: "ServiceName",
        spanTitle: "SpanTitle",
        source: {
            TraceId: "Id",
            SpanId: "Id",
            ParentSpanId: undefined,
            OperationName: "Value",
            BeginTimestamp: "Value",
            EndTimestamp: "Value",
            Annotations: undefined,
        },
        children: children || [],
    };
}

describe("TraceTreeUtils.getSpanNodeSelfTime", () => {
    it("should correct calculate time for empty span", () => {
        expect(TraceTreeUtils.getSpanNodeSelfTime(createSpan(0, 10))).to.eql(10);
    });

    it("should correct calculate time for child not fully intersected with parent", () => {
        expect(TraceTreeUtils.getSpanNodeSelfTime(createSpan(0, 10, [createSpan(5, 20)]))).to.eql(5);
        expect(TraceTreeUtils.getSpanNodeSelfTime(createSpan(0, 10, [createSpan(5, 20), createSpan(7, 25)]))).to.eql(5);
    });

    it("should correct calculate time for not intersected intervals", () => {
        expect(TraceTreeUtils.getSpanNodeSelfTime(createSpan(0, 10, [createSpan(1, 2)]))).to.eql(9);
        expect(TraceTreeUtils.getSpanNodeSelfTime(createSpan(0, 10, [createSpan(1, 2), createSpan(2, 3)]))).to.eql(8);
        expect(
            TraceTreeUtils.getSpanNodeSelfTime(
                createSpan(0, 10, [
                    createSpan(0, 1),
                    createSpan(1, 2),
                    createSpan(2, 3),
                    createSpan(3, 4),
                    createSpan(4, 5),
                    createSpan(5, 6),
                    createSpan(6, 7),
                    createSpan(7, 8),
                    createSpan(8, 9),
                    createSpan(9, 10),
                ])
            )
        ).to.eql(0);
    });

    it("should correct calculate time for not intersected intervals", () => {
        expect(TraceTreeUtils.getSpanNodeSelfTime(createSpan(0, 10, [createSpan(1, 3), createSpan(2, 4)]))).to.eql(7);
        expect(TraceTreeUtils.getSpanNodeSelfTime(createSpan(0, 10, [createSpan(1, 5), createSpan(2, 4)]))).to.eql(6);

        expect(TraceTreeUtils.getSpanNodeSelfTime(createSpan(0, 10, [createSpan(2, 4), createSpan(1, 3)]))).to.eql(7);
        expect(TraceTreeUtils.getSpanNodeSelfTime(createSpan(0, 10, [createSpan(2, 4), createSpan(1, 5)]))).to.eql(6);
    });
});
