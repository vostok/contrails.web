import { SpanInfo } from "../SpanInfo";

export interface SpanNode {
    type: "SingleSpan" | "FakeSpan";
    from: number;
    to: number;
    serviceName: string;
    spanTitle: string;
    colorConfig: number;
    source: SpanInfo;
    children: SpanNode[];
}
