// @flow
import moment from "moment";
import { NotImplementedError } from "commons/Errors";

import type { SpanInfo } from "../SpanInfo";
import { reduceTree } from "../Utils/TreeTraverseUtils";
import type { IDataExtractor } from "../IDataExtractor";

import type { SpanNode } from "./SpanNode";

export default class TraceTreeBuilder {
    dataExtractor: IDataExtractor;

    constructor(dataExtractor: IDataExtractor) {
        this.dataExtractor = dataExtractor;
    }

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
            serviceName: this.dataExtractor.getServiceName(span),
            spanTitle: this.dataExtractor.getSpanTitle(span),
            colorConfig: this.getColorConfig(span),
            source: span,
            children: spans
                .filter(x => x !== span && x.ParentSpanId != null && x.ParentSpanId === span.SpanId)
                .map(x => this.spanInfoToSpanNode(x, spans)),
        };
    }

    getColorConfig(span: SpanInfo): number {
        return this.dataExtractor.getColorConfig(span);
    }

    buildTraceTree(spans: Array<SpanInfo>): SpanNode {
        const root = spans.find(x => x.ParentSpanId == null);
        if (root == null) {
            // TODO построить фековай item
            throw new NotImplementedError();
        }
        const resultRoot = this.spanInfoToSpanNode(root, spans);
        //return resultRoot;
        return this.findAndCollapseRemoteCalls(resultRoot);
    }

    findAndCollapseRemoteCalls(root: SpanNode): SpanNode {
        return reduceTree(
            root,
            (childResults: Array<SpanNode>, node: SpanNode): SpanNode => {
                if (
                    node.type === "SingleSpan" &&
                    node.source.Annotations != null &&
                    node.source.Annotations.IsClientSpan === true &&
                    childResults.length === 1
                ) {
                    const singleChild = childResults[0];
                    if (
                        singleChild.type === "SingleSpan" &&
                        singleChild.source.Annotations != null &&
                        singleChild.source.Annotations.IsClientSpan === false
                    ) {
                        return {
                            type: "RemoteCallSpan",
                            from: node.from,
                            to: node.to,
                            serviceName: node.serviceName,
                            spanTitle: node.spanTitle,
                            colorConfig: node.colorConfig,
                            ...this.getAdjustedServerRange(node, singleChild),
                            clientSource: node.source,
                            serverSource: singleChild.source,
                            children: singleChild.children,
                        };
                    }
                }
                // Очень странно
                if (node.type === "SingleSpan" || node.type === "FakeSpan") {
                    return {
                        ...node,
                        children: childResults,
                    };
                }
                if (node.type === "RemoteCallSpan") {
                    return {
                        ...node,
                        children: childResults,
                    };
                }
                throw new Error("InvalidProgramState");
            },
            x => x.children
        );
    }

    getAdjustedServerRange(
        clientNode: SpanNode,
        serverNode: SpanNode
    ): { serverTimeShift: number, serverRange: { from: number, to: number } } {
        let serverFrom = null;
        let serverTo = null;
        let timeShift = null;
        if (serverNode.to > clientNode.to) {
            timeShift = -(serverNode.to - clientNode.to);
            serverTo = serverNode.to + timeShift;
            serverFrom = serverNode.from + timeShift;
            if (serverFrom < clientNode.from) {
                serverFrom = clientNode.from;
            }
        } else if (serverNode.from < clientNode.from) {
            timeShift = clientNode.from - serverNode.from;
            serverTo = serverNode.to + timeShift;
            serverFrom = serverNode.from + timeShift;
            if (serverTo > clientNode.to) {
                serverTo = clientNode.to;
            }
        } else {
            serverFrom = serverNode.from;
            serverTo = serverNode.to;
            timeShift = 0;
        }
        return {
            serverTimeShift: timeShift,
            serverRange: {
                from: serverFrom,
                to: serverTo,
            },
        };
    }

    buildNodeMap(tree: SpanNode): { [key: string]: SpanNode } {
        const getid = (node: SpanNode) =>
            node.type === "RemoteCallSpan" ? node.clientSource.SpanId : node.source.SpanId;
        return reduceTree(
            tree,
            (childResults, node) => childResults.reduce(merge, { [getid(node)]: node }),
            x => x.children
        );
    }
}

function merge<T, U>(x: T, y: U): T & U {
    return Object.assign(x, y);
}
