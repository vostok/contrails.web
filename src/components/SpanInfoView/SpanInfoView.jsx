// @flow
import * as React from "react";

import DateTimeUtils from "../../Domain/DateTimeUtils";
import type { SpanNode } from "../../Domain/TraceTree/SpanNode";
import TraceTreeUtils from "../../Domain/TraceTree/TraceTreeUtils";

import cn from "./SpanInfoView.less";

type SpanInfoViewProps = {
    root: SpanNode,
    span: SpanNode,
};

export default function SpanInfoView({ span, root }: SpanInfoViewProps): React.Node {
    if (span.type === "RemoteCallSpan") {
        const clientSpanInfo = span.clientSource;
        const clientAnnotations = clientSpanInfo.Annotations;

        const serverSpanInfo = span.serverSource;
        const serverAnnotations = serverSpanInfo.Annotations;

        return (
            <div>
                <div className={cn("section")}>
                    <div className={cn("section-header")}>CLIENT</div>
                    <div className={cn("section-header")}>General</div>
                    <div className={cn("item")}>
                        <div className={cn("caption")}>TraceId:</div>
                        <span className={cn("value")}>{clientSpanInfo.TraceId}</span>
                    </div>

                    <div className={cn("item")}>
                        <div className={cn("caption")}>SpanId:</div>
                        <span className={cn("value")}>{clientSpanInfo.SpanId}</span>
                    </div>
                    <div className={cn("item")}>
                        <div className={cn("caption")}>ParentSpanId:</div>
                        <span className={cn("value")}>{clientSpanInfo.ParentSpanId}</span>
                    </div>
                    <div className={cn("item")}>
                        <div className={cn("caption")}>OperationName:</div>
                        <span className={cn("value")}>{clientSpanInfo.OperationName}</span>
                    </div>
                    <div className={cn("item")}>
                        <div className={cn("caption")}>Duration:</div>
                        <span className={cn("value")}>
                            {DateTimeUtils.formatDurationTicks(
                                DateTimeUtils.difference(clientSpanInfo.EndTimestamp, clientSpanInfo.BeginTimestamp)
                            )}
                        </span>
                    </div>
                    <div className={cn("item")}>
                        <div className={cn("caption")}>BeginTimestamp:</div>
                        {renderTimestampSection(root, span, clientSpanInfo.BeginTimestamp)}
                    </div>
                    <div className={cn("item")}>
                        <div className={cn("caption")}>EndTimestamp:</div>
                        {renderTimestampSection(root, span, clientSpanInfo.EndTimestamp)}
                    </div>
                </div>
                {clientAnnotations != null && (
                    <div className={cn("section")}>
                        <div className={cn("section-header")}>Annotations</div>
                        {Object.getOwnPropertyNames(clientAnnotations).map(x => (
                            <div key={x} className={cn("item")}>
                                <div className={cn("caption")}>{x}:</div>
                                <span className={cn("value")}>{renderValue(clientAnnotations[x])}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div className={cn("section")}>
                    <div className={cn("section-header")}>SERVER</div>
                    <div className={cn("section-header")}>General</div>
                    <div className={cn("item")}>
                        <div className={cn("caption")}>TraceId:</div>
                        <span className={cn("value")}>{serverSpanInfo.TraceId}</span>
                    </div>

                    <div className={cn("item")}>
                        <div className={cn("caption")}>SpanId:</div>
                        <span className={cn("value")}>{serverSpanInfo.SpanId}</span>
                    </div>
                    <div className={cn("item")}>
                        <div className={cn("caption")}>ParentSpanId:</div>
                        <span className={cn("value")}>{serverSpanInfo.ParentSpanId}</span>
                    </div>
                    <div className={cn("item")}>
                        <div className={cn("caption")}>OperationName:</div>
                        <span className={cn("value")}>{serverSpanInfo.OperationName}</span>
                    </div>
                    <div className={cn("item")}>
                        <div className={cn("caption")}>Duration:</div>
                        <span className={cn("value")}>
                            {DateTimeUtils.formatDurationTicks(
                                DateTimeUtils.difference(serverSpanInfo.EndTimestamp, serverSpanInfo.BeginTimestamp)
                            )}
                        </span>
                    </div>
                    <div className={cn("item")}>
                        <div className={cn("caption")}>BeginTimestamp:</div>
                        {renderTimestampSection(root, span, serverSpanInfo.BeginTimestamp)}
                    </div>
                    <div className={cn("item")}>
                        <div className={cn("caption")}>EndTimestamp:</div>
                        {renderTimestampSection(root, span, serverSpanInfo.EndTimestamp)}
                    </div>
                </div>
                {serverAnnotations != null && (
                    <div className={cn("section")}>
                        <div className={cn("section-header")}>Annotations</div>
                        {Object.getOwnPropertyNames(serverAnnotations).map(x => (
                            <div key={x} className={cn("item")}>
                                <div className={cn("caption")}>{x}:</div>
                                <span className={cn("value")}>{renderValue(serverAnnotations[x])}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
    const spanInfo = span.source;
    const annotations = spanInfo.Annotations;
    return (
        <div>
            <div className={cn("section")}>
                <div className={cn("section-header")}>General</div>
                <div className={cn("item")}>
                    <div className={cn("caption")}>TraceId:</div>
                    <span className={cn("value")}>{spanInfo.TraceId}</span>
                </div>

                <div className={cn("item")}>
                    <div className={cn("caption")}>SpanId:</div>
                    <span className={cn("value")}>{spanInfo.SpanId}</span>
                </div>
                <div className={cn("item")}>
                    <div className={cn("caption")}>ParentSpanId:</div>
                    <span className={cn("value")}>{spanInfo.ParentSpanId}</span>
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
            {annotations != null && (
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

function renderTimestampSection(root: SpanNode, node: SpanNode, value: string): React.Node {
    const parentSpan = TraceTreeUtils.getParentSpan(root, node);

    const rootSource = root.type === "RemoteCallSpan" ? root.clientSource : root.source;
    const relatedToRoot = DateTimeUtils.formatDurationTicks(DateTimeUtils.difference(value, rootSource.BeginTimestamp));

    let relatedToParent = null;
    if (parentSpan != null) {
        const parentSource = parentSpan.type === "RemoteCallSpan" ? parentSpan.clientSource : parentSpan.source;
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
            {relatedToParent != null && (
                <div className={cn("item")}>
                    <div className={cn("caption")}>Relative (parent begin):</div>
                    <span className={cn("value")}>{relatedToParent}</span>
                </div>
            )}
        </div>
    );
}

function renderValue(value: mixed): React.Node {
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
