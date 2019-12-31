import { SpanInfo } from "./SpanInfo";
import { VostokKnownAnnotations } from "./VostokSpanInfo";

export interface IDataExtractor {
    getServiceName(span: SpanInfo): string;
    getSpanTitle(span: SpanInfo): string;
    getHostName(span: SpanInfo): string;
    isServerSpan(span: SpanInfo): boolean;
    isClientSpan(span: SpanInfo): boolean;
    isFailedRequest(span: SpanInfo): boolean;
    isSuccessfulRequest(span: SpanInfo): boolean;
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

    public isFailedRequest(span: SpanInfo): boolean {
        const vostokAnnotations = this.getVostokAnnotations(span);
        if (vostokAnnotations == undefined) {
            return false;
        }        
        
        const code = vostokAnnotations["http.response.code"];
        if (code != undefined) {
            const numericCode = parseInt(code);
            if (numericCode < 200 || numericCode >= 300)
                return true;
        }

        return false;
    }

    public isSuccessfulRequest(span: SpanInfo): boolean {
        const vostokAnnotations = this.getVostokAnnotations(span);
        if (vostokAnnotations == undefined) {
            return false;
        }        
        
        const code = vostokAnnotations["http.response.code"];
        if (code != undefined) {
            const numericCode = parseInt(code);
            if (200 <= numericCode && numericCode < 300)
                return true;
        }

        return false;
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
