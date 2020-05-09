import { SpanInfo } from "./SpanInfo";
import { Status } from "./TraceTree/SpanNode";
import { VostokKnownAnnotations } from "./VostokSpanInfo";

export interface IDataExtractor {
    getServiceName(span: SpanInfo): string;
    getSpanTitle(span: SpanInfo): string;
    getHostName(span: SpanInfo): string;
    isServerSpan(span: SpanInfo): boolean;
    isClientSpan(span: SpanInfo): boolean;
    getStatus(span: SpanInfo): Status;
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
            return vostokAnnotations.host.toLowerCase().split(".")[0];
        }
        return "unknown";
    }

    public getSpanTitle(span: SpanInfo): string {
        const vostokAnnotations = this.getVostokAnnotations(span);
        if (vostokAnnotations.host === "string") {
            return vostokAnnotations.host;
        }
        return "";
    }

    public getStatus(span: SpanInfo): Status {
        if (span.OperationName == "FakeSpan") {
            return Status.Fake;
        }

        const vostokAnnotations = this.getVostokAnnotations(span);
        if (vostokAnnotations == undefined) {
            return Status.Unknown;
        }

        const code = vostokAnnotations["http.response.code"];
        if (code == undefined) {
            return Status.Unknown;
        }

        const numericCode = parseInt(code);

        // Successful
        if (numericCode >= 200 && numericCode < 300) {
            return Status.Ok;
        }

        // Redirection
        if (numericCode >= 300 && numericCode < 400) {
            return Status.Ok;
        }

        // Informational
        if (numericCode >= 100 && numericCode < 200) {
            return Status.Ok;
        }

        // Server error
        if (numericCode >= 500 && numericCode < 600) {
            return Status.Error;
        }

        // NetworkError
        if (
            numericCode == 0 ||
            numericCode == 408 ||
            numericCode == 450 ||
            numericCode == 451 ||
            numericCode == 452 ||
            numericCode == 453
        ) {
            return Status.Error;
        }

        return Status.Warn;
    }

    public isSuccessfulRequest(span: SpanInfo): boolean {
        const vostokAnnotations = this.getVostokAnnotations(span);
        if (vostokAnnotations == undefined) {
            return false;
        }

        const code = vostokAnnotations["http.response.code"];
        if (code != undefined) {
            const numericCode = parseInt(code);
            if (100 <= numericCode && numericCode <= 399) {
                return true;
            }
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
