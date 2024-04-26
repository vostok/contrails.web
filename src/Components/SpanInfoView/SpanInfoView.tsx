import * as React from "react";

import {nullElement} from "../../Commons/TypingHacks";
import {DateTimeUtils} from "../../Domain/DateTimeUtils";
import {VostokDataExtractor} from "../../Domain/IDataExtractor";
import {SpanNode} from "../../Domain/TraceTree/SpanNode";
import {TraceTreeUtils} from "../../Domain/TraceTree/TraceTreeUtils";

import cn from "./SpanInfoView.less";
import {SpanAnnotations, SpanInfo} from "../../Domain/SpanInfo";

interface SpanInfoViewProps {
    root: SpanNode;
    span?: SpanNode;
}

const dataExtractor = new VostokDataExtractor();

export function SpanInfoView({span, root}: SpanInfoViewProps): null | JSX.Element {
    if (span == undefined)
        return nullElement;

    const spanInfo = span.source;
    const annotations = spanInfo.Annotations;

    const parent = {traceId: spanInfo.Annotations["ParentTraceId"], spanId: spanInfo.Annotations["ParentTraceSpanId"]};

    const duration = DateTimeUtils.formatDurationTicks(
        DateTimeUtils.difference(spanInfo.EndTimestamp, spanInfo.BeginTimestamp)
    );
    return (
        <div>
            <div className={cn("section")}>
                <div className={cn("section-header")}>
                    General <LogsLink spanInfo={spanInfo}/>
                </div>
                <Annotation name="TraceId" value={spanInfo.TraceId}/>
                <Annotation name="SpanId" value={spanInfo.SpanId} href={`##${spanInfo.SpanId}`}/>
                <Annotation name="ParentSpanId" value={spanInfo.ParentSpanId} href={`##${spanInfo.ParentSpanId}`}/>
                <Annotation name="OperationName" value={spanInfo.OperationName}/>
                <Annotation name="Duration" value={duration}/>
                <TimestampSection name="BeginTimestamp" value={spanInfo.BeginTimestamp} root={root} node={span}/>
                <TimestampSection name="EndTimestamp" value={spanInfo.EndTimestamp} root={root} node={span}/>
                {(parent.traceId || parent.spanId) && <ParentTraceInfo {...parent}/>}
            </div>
            {annotations && <AnnotationsSection annotations={annotations}/>}
        </div>
    );
}

function ParentTraceInfo(props: { traceId: unknown | undefined | null, spanId: unknown | undefined | null }): React.ReactElement {
    const {traceId, spanId} = props;
    return (<>
        <Annotation name="ParentTraceId" value={traceId} href={`/${traceId}`} newTab/>
        <Annotation name="ParentTraceSpanId" value={spanId}
                    href={traceId ? `/${traceId}##${spanId}` : null}
                    newTab/>
    </>);
}

function AnnotationsSection(props: { annotations: SpanAnnotations }) {
    const {annotations} = props;
    return (
        <div className={cn("section")}>
            <div className={cn("section-header")}>Annotations</div>
            {Object.getOwnPropertyNames(annotations)
                .sort(sortAnnotations)
                .filter(name => name !== "ParentTraceId" && name !== "ParentTraceSpanId")
                .map(name => (<Annotation name={name} value={annotations[name]}/>))}
        </div>
    );
}

function TimestampSection(props: { root: SpanNode, node: SpanNode, name: string, value: string }): React.ReactElement {
    const {root, node, name, value} = props;
    const parentSpan = TraceTreeUtils.getParentSpan(root, node);
    let relatedToParent;
    if (parentSpan != undefined && node.source.Annotations["host"] == parentSpan.source.Annotations["host"]) {
        relatedToParent = DateTimeUtils.formatDurationTicks(
            DateTimeUtils.difference(value, parentSpan.source.BeginTimestamp)
        );
    }

    return (
        <div className={cn("item")}>
            <div className={cn("caption")}>{name}:</div>
            <div className={cn("sub-section")}>
                <Annotation name="UTC" value={DateTimeUtils.formatDatePreciseUtc(value)}/>
                {relatedToParent && <Annotation name="Relative (parent begin)" value={relatedToParent}/>}
            </div>
        </div>
    );
}

function Annotation(props: { name: string, value: unknown, href?: string | null, newTab?: boolean }): React.ReactElement {
    const {name, value, href, newTab} = props;

    const renderValue = href
        ? ((value: React.ReactNode) => <a href={href} target={newTab ? "_blank" : "_self"}>{value}</a>)
        : ((value: React.ReactNode) => value);

    return (
        <div key={name} className={cn("item")}>
            <div className={cn("caption")}>{name}:</div>
            <span className={cn("value")}>
                {renderValue(getAnnotationValue(value))}
           </span>
        </div>
    );
}

function LogsLink(props: { spanInfo: SpanInfo }): React.ReactElement | null {
    const {spanInfo} = props;

    const app = dataExtractor.getServiceName(spanInfo);
    const host = dataExtractor.getHostName(spanInfo);

    if (app === "Unknown Service" || host === "unknown")
        return null;

    const href = `/contrails/api/logs?traceId=${
        spanInfo.TraceId
    }&host=${host}&application=${app}&beginTimestamp=${
        encodeURIComponent(spanInfo.BeginTimestamp)
    }&endTimestamp=${
        encodeURIComponent(spanInfo.EndTimestamp)
    }`;

    return <a target="_blank" href={href}>(logs)</a>;
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

    let indexA = sortingArr.indexOf(a);
    let indexB = sortingArr.indexOf(b);

    if (indexA == -1 && indexB == -1) {
        return a.localeCompare(b);
    }

    if (indexA == -1) {
        indexA = sortingArr.length;
    }

    if (indexB == -1) {
        indexB = sortingArr.length;
    }

    return indexA - indexB;
}

function getAnnotationValue(value: unknown): string {
    switch (typeof value) {
        case "string":
            return value;
        case "number":
            return value.toString();
        case "boolean":
            return value ? "TRUE" : "FALSE";
        default:
            return JSON.stringify(value);
    }
}
