// @flow
import type { SpanInfo } from "./SpanInfo";

export interface IDataExtractor {
    getServiceName(span: SpanInfo): string;
    getSpanTitle(span: SpanInfo): string;
    getColorConfig(span: SpanInfo): number;
}

export class LogsearchDataExtractor implements IDataExtractor {
    getServiceName(span: SpanInfo): string {
        return (span.Annotations && span.Annotations.OriginId) || "Unknown Service";
    }

    getSpanTitle(span: SpanInfo): string {
        return (span.Annotations && span.Annotations.OriginHost) || "";
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
}

export class VostokDataExtractor implements IDataExtractor {
    getServiceName(span: SpanInfo): string {
        return (span.Annotations && span.Annotations.service) || "Unknown Service";
    }

    getSpanTitle(span: SpanInfo): string {
        return (span.Annotations && span.Annotations.host) || "";
    }

    getColorConfig(_span: SpanInfo): number {
        return 0;
    }
}
