import moment from "moment";

import { NotImplementedError } from "../../Commons/Errors";
import { IDataExtractor } from "../IDataExtractor";
import { SpanInfo } from "../SpanInfo";

import { SpanNode, Status } from "./SpanNode";

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

        const childrenDict = new Map<string, SpanInfo[]>();
        spans.forEach(span => {
            const parent = span.ParentSpanId;
            if (parent != undefined) {
                childrenDict.set(parent, childrenDict.get(parent) || []);
                // @ts-ignore
                childrenDict.get(parent).push(span);
            }
        });

        const resultRoot = this.spanInfoToSpanNode(root, childrenDict);
        return resultRoot;
    }

    private spanInfoToSpanNode(span: SpanInfo, childrenDict: Map<string, SpanInfo[]>): SpanNode {
        if (span.OperationName === "FakeSpan") {
            return {
                type: "FakeSpan",
                from: moment(span.BeginTimestamp).valueOf(),
                to: moment(span.EndTimestamp).valueOf(),
                status: Status.Fake,
                serviceName: "FakeSpan",
                source: span,
                children: (childrenDict.get(span.SpanId) || [])
                    .map(x => this.spanInfoToSpanNode(x, childrenDict))
                    .sort((x, y) => x.from - y.from),
            };
        }
        return {
            type: "SingleSpan",
            from: moment(span.BeginTimestamp).valueOf(),
            to: moment(span.EndTimestamp).valueOf(),
            status: Status.Unknown,
            serviceName: this.dataExtractor.getServiceName(span),
            source: span,
            children: (childrenDict.get(span.SpanId) || [])
                .map(x => this.spanInfoToSpanNode(x, childrenDict))
                .sort((x, y) => x.from - y.from),
        };
    }
}
