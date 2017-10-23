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
                    .filter(x => x !== span && x.ParentSpanId != null && x.ParentSpanId === span.SpanId)
                    .map(x => this.spanInfoToSpanNode(x, spans)),
            };
        }
        return {
            type: "SingleSpan",
            from: moment(span.BeginTimestamp).valueOf(),
            to: moment(span.EndTimestamp).valueOf(),
            serviceName: (span.Annotations && span.Annotations.OriginId) || "Unknown Service",
            spanTitle: "",
            colorConfig: this.getColorConfig(span),
            source: span,
            children: spans
                .filter(x => x !== span && x.ParentSpanId != null && x.ParentSpanId === span.SpanId)
                .map(x => this.spanInfoToSpanNode(x, spans)),
        };
    }

    getColorConfig(span: SpanInfo): number {
        if (span.Annotations == null) {
            return 0;
        }
        if (
            (typeof span.Annotations.OriginId === "string" && span.Annotations.OriginId.startsWith("Billy")) ||
            span.Annotations.OriginId.startsWith("Billing")
        ) {
            return 3;
        }
        if (typeof span.Annotations.OriginId === "string" && span.Annotations.OriginId.startsWith("Web.UI")) {
            return 2;
        }
        return 0;
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
