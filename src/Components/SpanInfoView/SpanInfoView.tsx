import { Copy, PC } from "@skbkontur/react-icons";
import * as React from "react";

import { nullElement } from "../../Commons/TypingHacks";
import { DateTimeUtils } from "../../Domain/DateTimeUtils";
import { VostokDataExtractor } from "../../Domain/IDataExtractor";
import { SpanNode } from "../../Domain/TraceTree/SpanNode";
import { TraceTreeUtils } from "../../Domain/TraceTree/TraceTreeUtils";
import { findParentNode } from "../../Domain/Utils/FindParentTreeNodeVisitor";

import cn from "./SpanInfoView.less";

interface SpanInfoViewProps {
    root: SpanNode;
    span?: SpanNode;
}

interface ServiceIconProps {
    root: SpanNode;
    span: SpanNode;
    parentSpan?: SpanNode;
}

const dataExtractor = new VostokDataExtractor();

function SpanMainInfo({ span, parentSpan, root }: ServiceIconProps): JSX.Element {
    if (dataExtractor.isServerSpan(span.source) && parentSpan != undefined) {
        return (
            <span>
                <div>Server request process</div>
                <div>
                    {parentSpan.source.Annotations["operation"]} - {parentSpan.source.Annotations["http.response.code"]}
                </div>
                <div>
                    <Copy /> {span.serviceName} @ <PC /> {span.source.Annotations["host"]}
                </div>
                <div>
                    Duration:{" "}
                    {DateTimeUtils.formatDurationTicks(
                        DateTimeUtils.difference(span.source.EndTimestamp, span.source.BeginTimestamp)
                    )}
                </div>
            </span>
        );
    }
    if (
        dataExtractor.isClientSpan(span.source) &&
        span.children.length === 1 &&
        dataExtractor.isServerSpan(span.children[0].source)
    ) {
        return (
            <span>
                <div>Client request</div>
                <div>
                    {span.source.Annotations["operation"]} - {span.source.Annotations["http.response.code"]}
                </div>
                <div>
                    <Copy /> {span.serviceName} @ <PC /> {span.source.Annotations["host"]}
                </div>
                <div>
                    Duration:{" "}
                    {DateTimeUtils.formatDurationTicks(
                        DateTimeUtils.difference(span.source.EndTimestamp, span.source.BeginTimestamp)
                    )}
                </div>
            </span>
        );
    }
    return (
        <span>
            <div>Client operation</div>
            <div>
                <Copy /> {span.serviceName} @ <PC /> {span.source.Annotations["host"]}
            </div>
            <div>
                Duration:{" "}
                {DateTimeUtils.formatDurationTicks(
                    DateTimeUtils.difference(span.source.EndTimestamp, span.source.BeginTimestamp)
                )}
            </div>
        </span>
    );
}

export function SpanInfoView({ span, root }: SpanInfoViewProps): null | JSX.Element {
    if (span == undefined) {
        return nullElement;
    }
    const spanInfo = span.source;
    const annotations = spanInfo.Annotations;
    return (
        <div>
            <SpanMainInfo span={span} parentSpan={findParentNode(root, span, x => x.children)} />
            <div className={cn("section")}>
                <div className={cn("section-header")}>General</div>
                <div className={cn("item")}>
                    <div className={cn("caption")}>TraceId:</div>
                    <span className={cn("value")}>{spanInfo.TraceId}</span>
                </div>

                <div className={cn("item")}>
                    <div className={cn("caption")}>SpanId:</div>
                    <span className={cn("value")}>
                        <a href={`##${spanInfo.SpanId}`}>{spanInfo.SpanId}</a>
                    </span>
                </div>
                <div className={cn("item")}>
                    <div className={cn("caption")}>ParentSpanId:</div>
                    <span className={cn("value")}>
                        <a href={`##${spanInfo.ParentSpanId}`}>{spanInfo.ParentSpanId}</a>
                    </span>
                </div>
                <div className={cn("item")}>
                    <div className={cn("caption")}>OperationName:</div>
                    <span className={cn("value")}>{spanInfo.OperationName}</span>
                </div>
                <div className={cn("item")}>
                    <div className={cn("caption")}>Duration:</div>
                    <span className={cn("value")}>
                        {DateTimeUtils.formatDurationTicks(
                            DateTimeUtils.difference(spanInfo.EndTimestamp, spanInfo.BeginTimestamp)
                        )}
                    </span>
                </div>
                <div className={cn("item")}>
                    <div className={cn("caption")}>BeginTimestamp:</div>
                    {renderTimestampSection(root, span, spanInfo.BeginTimestamp)}
                </div>
                <div className={cn("item")}>
                    <div className={cn("caption")}>EndTimestamp:</div>
                    {renderTimestampSection(root, span, spanInfo.EndTimestamp)}
                </div>
            </div>
            {annotations != undefined && (
                <div className={cn("section")}>
                    <div className={cn("section-header")}>Annotations</div>
                    {Object.getOwnPropertyNames(annotations).map(x => (
                        <div key={x} className={cn("item")}>
                            <div className={cn("caption")}>{x}:</div>
                            <span className={cn("value")}>{renderValue(annotations[x])}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function renderTimestampSection(root: SpanNode, node: SpanNode, value: string): React.ReactNode {
    const parentSpan = TraceTreeUtils.getParentSpan(root, node);

    const rootSource = root.source;
    const relatedToRoot = DateTimeUtils.formatDurationTicks(DateTimeUtils.difference(value, rootSource.BeginTimestamp));

    let relatedToParent;
    if (parentSpan != undefined) {
        const parentSource = parentSpan.source;
        relatedToParent = DateTimeUtils.formatDurationTicks(
            DateTimeUtils.difference(value, parentSource.BeginTimestamp)
        );
    }

    return (
        <div className={cn("sub-section")}>
            <div className={cn("item")}>
                <div className={cn("caption")}>UTC: </div>
                <span className={cn("value")}>{DateTimeUtils.formatDatePreciseUtc(value)}</span>
            </div>
            <div className={cn("item")}>
                <div className={cn("caption")}>Relative (root begin):</div>
                <span className={cn("value")}>{relatedToRoot}</span>
            </div>
            {relatedToParent != undefined && (
                <div className={cn("item")}>
                    <div className={cn("caption")}>Relative (parent begin):</div>
                    <span className={cn("value")}>{relatedToParent}</span>
                </div>
            )}
        </div>
    );
}

function renderValue(value: unknown): React.ReactNode {
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "boolean") {
        return value ? "TRUE" : "FALSE";
    }
    if (typeof value === "number") {
        return value;
    }
    return JSON.stringify(value);
}
