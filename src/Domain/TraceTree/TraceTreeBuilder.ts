import moment from "moment";

import { NotImplementedError } from "../../Commons/Errors";
import { IDataExtractor } from "../IDataExtractor";
import { SpanInfo } from "../SpanInfo";

import { SpanNode } from "./SpanNode";

export class TraceTreeBuilder {
    public dataExtractor: IDataExtractor;

    public constructor(dataExtractor: IDataExtractor) {
        this.dataExtractor = dataExtractor;
    }

    public buildTraceTree(spans: SpanInfo[]): SpanNode {
        const root = spans.find(x => x.ParentSpanId == undefined);
        if (root == undefined) {
            // TODO построить фековай item
            throw new NotImplementedError();
        }
        const resultRoot = this.spanInfoToSpanNode(root, spans);
        return resultRoot;
    }

    private spanInfoToSpanNode(span: SpanInfo, spans: SpanInfo[]): SpanNode {
        if (span.OperationName === "FakeSpan") {
            return {
                type: "FakeSpan",
                from: moment(span.BeginTimestamp).valueOf(),
                to: moment(span.EndTimestamp).valueOf(),
                serviceName: "FakeSpan",
                spanTitle: "",
                colorConfig: 5,
                source: span,
                children: spans
                    .filter(x => x !== span && x.ParentSpanId != undefined && x.ParentSpanId === span.SpanId)
                    .map(x => this.spanInfoToSpanNode(x, spans))
                    .sort((x, y) => x.from - y.from),
            };
        }
        return {
            type: "SingleSpan",
            from: moment(span.BeginTimestamp).valueOf(),
            to: moment(span.EndTimestamp).valueOf(),
            serviceName: this.dataExtractor.getServiceName(span),
            spanTitle: this.dataExtractor.getSpanTitle(span),
            colorConfig: this.getColorConfig(span),
            source: span,
            children: spans
                .filter(x => x !== span && x.ParentSpanId != undefined && x.ParentSpanId === span.SpanId)
                .map(x => this.spanInfoToSpanNode(x, spans))
                .sort((x, y) => x.from - y.from),
        };
    }

    private getColorConfig(span: SpanInfo): number {
        return this.dataExtractor.getColorConfig(span);
    }
}
