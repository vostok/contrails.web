import { expect } from "chai";
import moment from "moment";

import { VostokDataExtractor } from "../src/Domain/IDataExtractor";
import { SpanInfo } from "../src/Domain/SpanInfo";
import { SpansToLinesArranger } from "../src/Domain/SpanLines/SpansToLinesArranger";
import { TraceTreeBuilder } from "../src/Domain/TraceTree/TraceTreeBuilder";

describe("SpansToLinesArranger.arrange", () => {
    it("должен располагать элементы друг под другом", () => {
        const arranger = new SpansToLinesArranger();
        const spans: SpanInfo[] = [
            {
                BeginTimestamp: moment("2013-02-08 12:00:00.000").format(),
                EndTimestamp: moment("2013-02-08 12:10:00.000").format(),
                TraceId: "1",
                SpanId: "1",
                OperationName: "Name",
            },
            {
                BeginTimestamp: moment("2013-02-08 12:00:00.000").format(),
                EndTimestamp: moment("2013-02-08 12:10:00.000").format(),
                TraceId: "1",
                SpanId: "2",
                ParentSpanId: "1",
                OperationName: "Name",
            },
        ];
        const spansByLines = arranger.arrange(new TraceTreeBuilder(new VostokDataExtractor()).buildTraceTree(spans));
        // @ts-ignore Мне тупо лень
        // tslint:disable-next-line no-unsafe-any
        expect(spansByLines[0].items[0].source.source.SpanId).to.eql(spans[0].SpanId);
        // @ts-ignore Мне тупо лень
        // tslint:disable-next-line no-unsafe-any
        expect(spansByLines[1].items[0].source.source.SpanId).to.eql(spans[1].SpanId);
    });
});
