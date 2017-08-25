// @flow
import moment from "moment";
import { expect } from "chai";

import TraceTreeBuilder from "../src/Domain/TraceTree/TraceTreeBuilder";
import SpansToLinesArranger from "../src/Domain/SpanLines/SpansToLinesArranger";

describe("SpansToLinesArranger.arrange", () => {
    it("должен располагать элементы друг под другом", () => {
        const arranger = new SpansToLinesArranger();
        const spans = [
            {
                BeginTimestamp: moment("2013-02-08 12:00:00.000").format(),
                EndTimestamp: moment("2013-02-08 12:10:00.000").format(),
                TraceId: "1",
                SpanId: "1",
                OperationName: "Name",
                Annotations: null,
            },
            {
                BeginTimestamp: moment("2013-02-08 12:00:00.000").format(),
                EndTimestamp: moment("2013-02-08 12:10:00.000").format(),
                TraceId: "1",
                SpanId: "2",
                ParentSpanId: "1",
                OperationName: "Name",
                Annotations: null,
            },
        ];
        const spansByLines = arranger.arrange(new TraceTreeBuilder().buildTraceTree(spans));
        expect(spansByLines[0].items[0].source.source.SpanId).to.eql(spans[0].SpanId);
        expect(spansByLines[1].items[0].source.source.SpanId).to.eql(spans[1].SpanId);
    });
});
