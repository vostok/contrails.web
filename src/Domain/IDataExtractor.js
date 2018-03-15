// @flow
import type { SpanInfo } from "./SpanInfo";

export interface IDataExtractor {
    getServiceName(span: SpanInfo): string;
    getSpanTitle(span: SpanInfo): string;
    getColorConfig(span: SpanInfo): number;
}

export class LogsearchDataExtractor implements IDataExtractor {
    getServiceName(span: SpanInfo): string {
        if (span.Annotations && typeof span.Annotations.OriginId === "string") {
            return span.Annotations.OriginId;
        }
        return "Unknown Service";
    }

    getSpanTitle(span: SpanInfo): string {
        if (span.Annotations && typeof span.Annotations.OriginHost === "string") {
            return span.Annotations.OriginHost;
        }
        return "";
    }

    getColorConfig(span: SpanInfo): number {
        if (span.Annotations == null) {
            return 0;
        }
        const { OriginId } = span.Annotations;
        if (typeof OriginId === "string" && (OriginId.startsWith("Billy") || OriginId.startsWith("Billing"))) {
            return 3;
        }
        if (typeof OriginId === "string" && OriginId.startsWith("Web.UI")) {
            return 2;
        }
        return 0;
    }
}

export class VostokDataExtractor implements IDataExtractor {
    getServiceName(span: SpanInfo): string {
        if (span.Annotations && typeof span.Annotations.service === "string") {
            return span.Annotations.service;
        }
        return "Unknown Service";
    }

    getSpanTitle(span: SpanInfo): string {
        if (span.Annotations && typeof span.Annotations.host === "string") {
            return span.Annotations.host;
        }
        return "";
    }

    getColorConfig(span: SpanInfo): number {
        if (span.Annotations == null) {
            return 0;
        }
        const { service } = span.Annotations;
        if (typeof service === "string" && (service.startsWith("Billy") || service.startsWith("Billing"))) {
            return 3;
        }
        if (typeof service === "string" && service.startsWith("Web.UI")) {
            return 2;
        }
        return 0;
    }
}
