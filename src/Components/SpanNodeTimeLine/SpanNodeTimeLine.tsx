import * as React from "react";

import { useComponentWidth } from "../../Commons/Hooks/UseComponentWidth";
import { Colors } from "../../Domain/Colors";
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
    const left = Math.round(((node.from - totalTimeRange.from) / timeRangeDuration) * width);
    const timeLineWidth = Math.max(4, (nodeDuration / timeRangeDuration) * width);

    return (
        <div ref={container} className={cn("container")}>
            <div
                className={cn("time-span", { faded: !highlighted })}
                style={{
                    backgroundColor: Colors[node.colorConfig].background,
                    width: timeLineWidth,
                    left: left,
                }}>
            </div>
        </div>
    );
}
