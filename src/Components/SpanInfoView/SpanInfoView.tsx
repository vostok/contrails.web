import * as React from "react";

import { nullElement } from "../../Commons/TypingHacks";
import { DateTimeUtils } from "../../Domain/DateTimeUtils";
import { VostokDataExtractor } from "../../Domain/IDataExtractor";
import { SpanNode } from "../../Domain/TraceTree/SpanNode";
import { TraceTreeUtils } from "../../Domain/TraceTree/TraceTreeUtils";

import cn from "./SpanInfoView.less";
import { SpanAnnotations, SpanInfo } from "../../Domain/SpanInfo";

interface SpanInfoViewProps {
    root: SpanNode;
    span?: SpanNode;
}

const dataExtractor = new VostokDataExtractor();
const BASE_INDENT = 8;

export function SpanInfoView({ span, root }: SpanInfoViewProps): null | JSX.Element {
    if (span == undefined) return nullElement;

    const spanInfo = span.source;
    const annotations = spanInfo.Annotations;

    const parent = {
        traceId: spanInfo.Annotations["ParentTraceId"],
        spanId: spanInfo.Annotations["ParentTraceSpanId"],
    };

    const duration = DateTimeUtils.formatDurationTicks(
        DateTimeUtils.difference(spanInfo.EndTimestamp, spanInfo.BeginTimestamp)
    );
    return (
        <div>
            <div className={cn("section")}>
                <div className={cn("section-header")}>
                    General <LogsLink spanInfo={spanInfo} />
                </div>
                <Annotation name="TraceId" value={spanInfo.TraceId} />
                <Annotation name="SpanId" value={spanInfo.SpanId} href={`##${spanInfo.SpanId}`} />
                <Annotation name="ParentSpanId" value={spanInfo.ParentSpanId} href={`##${spanInfo.ParentSpanId}`} />
                <Annotation name="OperationName" value={spanInfo.OperationName} />
                <Annotation name="Duration" value={duration} />
                <TimestampSection name="BeginTimestamp" value={spanInfo.BeginTimestamp} root={root} node={span} />
                <TimestampSection name="EndTimestamp" value={spanInfo.EndTimestamp} root={root} node={span} />
                {(parent.traceId || parent.spanId) && <ParentTraceInfo {...parent} />}
            </div>
            {annotations && <AnnotationsSection annotations={annotations} root={root} node={span} />}
        </div>
    );
}

function ParentTraceInfo(props: { traceId: unknown | undefined | null; spanId: unknown | undefined | null }): React.ReactElement {
    const { traceId, spanId } = props;
    return (
        <>
            <Annotation name="ParentTraceId" value={traceId} href={`${traceId}`} newTab />
            <Annotation
                name="ParentTraceSpanId"
                value={spanId}
                href={traceId ? `${traceId}##${spanId}` : null}
                newTab
            />
        </>
    );
}

function AnnotationsSection(props: { annotations: SpanAnnotations; root: SpanNode; node: SpanNode }) {
    const { annotations, root, node } = props;
    return (
        <div className={cn("section")}>
            <div className={cn("section-header")}>Annotations</div>
            {Object.getOwnPropertyNames(annotations)
                .sort(sortAnnotations)
                .filter(name => name !== "ParentTraceId" && name !== "ParentTraceSpanId")
                .map(name => (
                    <Annotation
                        key={name}
                        name={name}
                        value={annotations[name]}
                        level={0}
                        parentObj={annotations}
                        root={root}
                        node={node}
                    />
                ))}
        </div>
    );
}

function TimestampSection(props: { root: SpanNode; node: SpanNode; name: string; value: string;level?: number  }): React.ReactElement {
    const { root, node, name, value,level = 0  } = props;
        const marginLeft = { marginLeft: level * BASE_INDENT };

    const parentSpan = TraceTreeUtils.getParentSpan(root, node);
    let relatedToParent;
    if (parentSpan != undefined && node.source.Annotations["host"] == parentSpan.source.Annotations["host"]) {
        relatedToParent = DateTimeUtils.formatDurationTicks(
            DateTimeUtils.difference(value, parentSpan.source.BeginTimestamp)
        );
    }

    return (
        <div className={cn("item")} style={marginLeft}>
            <div className={cn("caption")}>{name}:</div>
            <div className={cn("sub-section")}>
                <Annotation name="UTC" value={DateTimeUtils.formatDatePreciseUtc(value)} />
                {relatedToParent && <Annotation name="Relative (parent begin)" value={relatedToParent} />}
            </div>
        </div>
    );
}

function Annotation(props: {
    name: string;
    value: unknown;
    href?: string | null;
    newTab?: boolean;
    level?: number;
    parentObj?: Record<string, any>;
    root?: SpanNode;
    node?: SpanNode;
}): React.ReactElement {
    const { name, value, href: propHref, newTab, level = 0, parentObj, root, node } = props;

    if (name === "timestampUtc" && typeof value === "string" && root && node) {
        return <TimestampSection name={name} level={level} value={value} root={root} node={node} />;
    }

    let keyBasedHref: string | undefined;

    if (typeof value === "string") {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("spanid")) {
            const traceIdFromBlock = parentObj?.traceId;
            keyBasedHref = traceIdFromBlock ? `${traceIdFromBlock}##${value}` : `##${value}`;
        } else if (lowerName.includes("traceid")) {
            keyBasedHref = value;
        }
    }
    const href = propHref ?? keyBasedHref;
        const marginLeft = { marginLeft: level * BASE_INDENT };

    const isPrimitive =
        value == null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";

    if (isPrimitive) {
        const content = href ? (
            <a href={href} target={newTab ? "_blank" : "_self"}>
                {String(value)}
            </a>
        ) : (
            String(value)
        );

        return (
            <div className={cn("item")} style={marginLeft}>
                {name && <div className={cn("caption")}>{name}:</div>}
                <span className={cn("value")}>{content}</span>
            </div>
        );
    }

    if (Array.isArray(value)) {
        return (
            <div className={cn("item")} style={marginLeft}>
                {name && <div className={cn("caption")}>{name}:</div>}
                {value.map((item, i) => (
                    <Annotation
                        key={i}
                        name=""
                        value={item}
                        level={level + 1}
                        parentObj={item as Record<string, any>}
                        root={root}
                        node={node}
                    />
                ))}
            </div>
        );
    }

    if (typeof value === "object") {
        const entries = Object.entries(value).sort(([a], [b]) => sortAnnotations(a, b));
        return (
            <div className={cn("item")} style={marginLeft}>
                {name && <div className={cn("caption")}>{name}:</div>}
                {entries.map(([k, v]) => (
                    <Annotation
                        key={k}
                        name={k}
                        value={v}
                        level={level + 1}
                        parentObj={value as Record<string, any>}
                        root={root}
                        node={node}
                    />
                ))}
            </div>
        );
    }

    return <></>;
}

function LogsLink(props: { spanInfo: SpanInfo }): React.ReactElement | null {
    const { spanInfo } = props;

    const app = dataExtractor.getServiceName(spanInfo);
    const host = dataExtractor.getHostName(spanInfo);

    if (app === "Unknown Service" || host === "unknown") return null;

    const href = `/dutymon/logs/forService?traceId=${
        spanInfo.TraceId
    }&host=${host}&service=${app}&from=${encodeURIComponent(spanInfo.BeginTimestamp)}&to=${encodeURIComponent(
        spanInfo.EndTimestamp
    )}`;

    return (
        <a target="_blank" href={href}>
            (logs)
        </a>
    );
}

function sortAnnotations(a: string, b: string): number {
    const sortingArr = [
        "kind",
        "application",
        "service.name",
        "environment",
        "deployment.environment",
        "host",
        "host.name",
        "component",
        "operation",
        "name",
        "status",
        "status.description",
    ];

    const lastKeys = ["events", "links"];

    if (lastKeys.includes(a) && !lastKeys.includes(b)) return 1;
    if (!lastKeys.includes(a) && lastKeys.includes(b)) return -1;
    if (lastKeys.includes(a) && lastKeys.includes(b)) return a.localeCompare(b);

    if (a === "annotations" && b !== "annotations") return 1;
    if (b === "annotations" && a !== "annotations") return -1;

    let indexA = sortingArr.indexOf(a);
    let indexB = sortingArr.indexOf(b);

if (indexA === -1 && indexB === -1) {
    return a.localeCompare(b);
}

if (indexA === -1) indexA = sortingArr.length;
if (indexB === -1) indexB = sortingArr.length;

    return indexA - indexB;
}
