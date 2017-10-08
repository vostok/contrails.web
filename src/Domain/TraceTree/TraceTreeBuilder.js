// @flow
import moment from "moment";
import { NotImplementedError } from "commons/Errors";

import type { SpanInfo } from "../SpanInfo";
import { reduceTree } from "../Utils/TreeTraverseUtils";

import type { SpanNode } from "./SpanNode";

export default class TraceTreeBuilder {
    spanInfoToSpanNode(span: SpanInfo, spans: Array<SpanInfo>): SpanNode {
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
                    .filter(x => x !== span)
                    .filter(x => x.ParentSpanId != null)
                    .filter(x => x.ParentSpanId === span.SpanId)
                    .map(x => this.spanInfoToSpanNode(x, spans)),
            };
        }
        return {
            type: "SingleSpan",
            from: moment(span.BeginTimestamp).valueOf(),
            to: moment(span.EndTimestamp).valueOf(),
            serviceName: (span.Annotations && span.Annotations.OriginId) || "Unknown Service",
            spanTitle: "",
            colorConfig: 0,
            source: span,
            children: spans
                .filter(x => x !== span)
                .filter(x => x.ParentSpanId != null)
                .filter(x => x.ParentSpanId === span.SpanId)
                .map(x => this.spanInfoToSpanNode(x, spans)),
        };
    }

    buildTraceTree(spans: Array<SpanInfo>): SpanNode {
        const root = spans.find(x => x.ParentSpanId == null);
        if (root == null) {
            // TODO построить фековай item
            throw new NotImplementedError();
        }
        return this.spanInfoToSpanNode(root, spans);
    }

    buildNodeMap(tree: SpanNode): { [key: string]: SpanNode } {
        return reduceTree(
            tree,
            (childResults, node) => childResults.reduce(merge, { [node.source.SpanId]: node }),
            x => x.children
        );
    }
}

function merge<T, U>(x: T, y: U): T & U {
    return Object.assign(x, y);
}
