// @flow
import type { SpanInfo } from "../SpanInfo";

export type SpanNode =
    | {
          type: "SingleSpan" | "FakeSpan",
          from: number,
          to: number,
          serviceName: string,
          spanTitle: string,
          colorConfig: number,
          source: SpanInfo,
          children: Array<SpanNode>,
      }
    | {
          type: "RemoteCallSpan",
          from: number,
          to: number,
          serverRange: {
              from: number,
              to: number,
          },
          serviceName: string,
          spanTitle: string,
          colorConfig: number,
          clientSource: SpanInfo,
          serverSource: SpanInfo,
          children: Array<SpanNode>,
      };
