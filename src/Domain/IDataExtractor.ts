import { SpanInfo } from "./SpanInfo";
import { VostokKnownAnnotations } from "./VostokSpanInfo";

export interface IDataExtractor {
    getServiceName(span: SpanInfo): string;
    getSpanTitle(span: SpanInfo): string;
    getColorConfig(span: SpanInfo): number;
    getHostName(span: SpanInfo): string;
    isServerSpan(span: SpanInfo): boolean;
    isClientSpan(span: SpanInfo): boolean;
}

export class VostokDataExtractor implements IDataExtractor {
    public getServiceName(span: SpanInfo): string {
        const vostokAnnotations = this.getVostokAnnotations(span);
        if (typeof vostokAnnotations.application === "string") {
            return vostokAnnotations.application;
        }
        return "Unknown Service";
    }

    public getHostName(span: SpanInfo): string {
        const vostokAnnotations = this.getVostokAnnotations(span);
        if (typeof vostokAnnotations.host === "string") {
            return vostokAnnotations.host;
        }
        return "Unknown Service";
    }

    public getSpanTitle(span: SpanInfo): string {
        const vostokAnnotations = this.getVostokAnnotations(span);
        if (vostokAnnotations.host === "string") {
            return vostokAnnotations.host;
        }
        return "";
    }

    public getColorConfig(span: SpanInfo): number {
        const vostokAnnotations = this.getVostokAnnotations(span);
        if (vostokAnnotations == undefined) {
            return 0;
        }
        const { application } = vostokAnnotations;
        if (application.startsWith("Billy") || application.startsWith("Billing")) {
            return 3;
        }
        if (application.startsWith("Web.UI")) {
            return 2;
        }
        return 0;
    }

    public isServerSpan(span: SpanInfo): boolean {
        const vostokAnnotations = this.getVostokAnnotations(span);
        if (vostokAnnotations == undefined) {
            return false;
        }
        return vostokAnnotations.kind === "http-request-server";
    }
    public isClientSpan(span: SpanInfo): boolean {
        const vostokAnnotations = this.getVostokAnnotations(span);
        if (vostokAnnotations == undefined) {
            return true;
        }
        return vostokAnnotations.kind === "http-request-client";
    }

    private getVostokAnnotations(span: SpanInfo): VostokKnownAnnotations {
        if (span.Annotations == undefined) {
            return {
                application: "",
                host: "",
                kind: "http-request-client",
            };
        }
        // @ts-ignore Всё получится
        return span.Annotations as VostokKnownAnnotations;
    }
}
