import * as React from "react";

import { useComponentWidth } from "../../Commons/Hooks/UseComponentWidth";
import { Colors } from "../../Domain/Colors";
import { DateTimeUtils } from "../../Domain/DateTimeUtils";
import { TimeRange } from "../../Domain/TimeRange";
import { SpanNode } from "../../Domain/TraceTree/SpanNode";

import cn from "./SpanNodeTimeLine.less";

interface SpanNodeTimeLineProps {
    node: SpanNode;
    totalTimeRange: TimeRange;
    highlighted: boolean;
}

export function SpanNodeTimeLine({ node, totalTimeRange, highlighted }: SpanNodeTimeLineProps): JSX.Element {
    const [width, container] = useComponentWidth<HTMLDivElement>(0);

    const timeRangeDuration = totalTimeRange.to - totalTimeRange.from;
    const nodeDuration = node.to - node.from;

    const nodeLeftInPixels = Math.round(((node.from - totalTimeRange.from) / timeRangeDuration) * width);
    const nodeWidthInPixels = Math.max(4, (nodeDuration / timeRangeDuration) * width);

    const leftOversize = Math.abs(Math.min(0, nodeLeftInPixels));
    const nodeLeftPosition = nodeLeftInPixels + leftOversize;
    const nodeWidthPosition = nodeWidthInPixels - leftOversize;

    const durationFormatted = DateTimeUtils.formatDurationTicks(
        DateTimeUtils.difference(node.source.EndTimestamp, node.source.BeginTimestamp)
    );

    return (
        <div ref={container} className={cn("container")}>
            <div
                className={cn("time-span", { faded: !highlighted })}
                style={{
                    backgroundColor: Colors[node.colorConfig].background,
                    width: nodeWidthPosition,
                    left: nodeLeftPosition,
                }}>
                <span
                    className={cn("duration", {
                        left: nodeLeftPosition >= 40,
                        right: nodeLeftPosition < 40 && width - (nodeLeftPosition + nodeWidthPosition) >= 40,
                        inside: nodeLeftPosition < 40 && width - (nodeLeftPosition + nodeWidthPosition) < 40,
                    })}>
                    <span className={cn("inner")}>{durationFormatted}</span>
                </span>
            </div>
        </div>
    );
}
