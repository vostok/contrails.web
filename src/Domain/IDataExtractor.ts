import {SpanInfo} from "./SpanInfo";
import {Status} from "./TraceTree/SpanNode";
import {VostokKnownAnnotations} from "./VostokSpanInfo";

export interface IDataExtractor {
    getServiceName(span: SpanInfo): string;
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
        if (typeof vostokAnnotations["service.name"] === "string") {
            return vostokAnnotations["service.name"];
        }
        return "Unknown Service";
    }

    public getHostName(span: SpanInfo): string {
        const vostokAnnotations = this.getVostokAnnotations(span);
        let result = "unknown";
        if (typeof vostokAnnotations.host === "string") {
            result = vostokAnnotations.host;
        }
        if (typeof vostokAnnotations["host.name"] === "string") {
            result = vostokAnnotations["host.name"];
        }
        return result.toLowerCase().split(".")[0];
    }

    public getHttpCode(span: SpanInfo): string | undefined {
        const vostokAnnotations = this.getVostokAnnotations(span);
        return vostokAnnotations["http.response.code"] ?? vostokAnnotations["http.status_code"];
    }

    public getStatus(span: SpanInfo): Status {
        if (span.OperationName == "FakeSpan") {
            return Status.Fake;
        }

        const vostokAnnotations = this.getVostokAnnotations(span);
        const status = vostokAnnotations["status"];
        if (status != undefined) {
            if (status === "success" || status === "Ok") {
                return Status.Ok;
            }
            if (status === "warning") {
                return Status.Warn;
            }
            if (status === "error" || status === "Error") {
                return Status.Error;
            }
        }

        const code = this.getHttpCode(span);
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

    public isServerSpan(span: SpanInfo): boolean {
        const vostokAnnotations = this.getVostokAnnotations(span);
        if (vostokAnnotations == undefined) {
            return false;
        }
        return vostokAnnotations.kind === "http-request-server" || vostokAnnotations.kind === "Server";
    }
    public isClientSpan(span: SpanInfo): boolean {
        const vostokAnnotations = this.getVostokAnnotations(span);
        if (vostokAnnotations == undefined) {
            return true;
        }
        return vostokAnnotations.kind === "http-request-client" || vostokAnnotations.kind === "Client";
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
