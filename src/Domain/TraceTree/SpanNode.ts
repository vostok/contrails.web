import { SpanInfo } from "../SpanInfo";

export interface SpanNode {
    type: "SingleSpan" | "FakeSpan";
    from: number;
    to: number;
    status: number;
    serviceName: string;
    spanTitle: string;
    source: SpanInfo;
    children: SpanNode[];
}

export enum Status {
    Unknown,
    Ok,
    Warn,
    Error,
    Fake,
}
