import * as React from "react";

import { emptyRef } from "../../Commons/TypingHacks";
import { Colors } from "../../Domain/Colors";
import { TimeRange } from "../../Domain/TimeRange";
import { SpanNode } from "../../Domain/TraceTree/SpanNode";

import cn from "./SpanNodeTimeLine.less";

interface SpanNodeTimeLineProps {
    node: SpanNode;
    totalTimeRange?: TimeRange;
}

export function SpanNodeTimeLine({ node, totalTimeRange }: SpanNodeTimeLineProps): JSX.Element {
    const container = React.useRef<HTMLDivElement>(emptyRef);
    const span = React.useRef<HTMLDivElement>(emptyRef);
    const containerWidth = React.useRef<undefined | number>();

    function updateSpanSize(): void {
        if (
            totalTimeRange == undefined ||
            container.current == undefined ||
            span.current == undefined ||
            containerWidth.current == undefined
        ) {
            return;
        }

        const timeRangeDuration = totalTimeRange.to - totalTimeRange.from;
        const nodeDuration = node.to - node.from;
        const left = Math.round(((node.from - totalTimeRange.from) / timeRangeDuration) * containerWidth.current);
        const width = Math.max(4, (nodeDuration / timeRangeDuration) * containerWidth.current);

        requestAnimationFrame(() => {
            if (span.current != undefined) {
                span.current.style.width = `${width}px`;
                span.current.style.left = `${left}px`;
            }
        });
    }

    function updateContainerWidth(): void {
        if (container.current != undefined) {
            containerWidth.current = container.current.getBoundingClientRect().width;
        }
        updateSpanSize();
    }

    React.useEffect(() => {
        updateContainerWidth();
        window.addEventListener("resize", updateContainerWidth);
        return () => window.removeEventListener("resize", updateContainerWidth);
    }, []);

    React.useEffect(updateSpanSize, [totalTimeRange]);

    return (
        <div ref={container} className={cn("container")}>
            <div
                ref={span}
                className={cn("time-span")}
                style={{
                    backgroundColor: Colors[node.colorConfig].background,
                }}
            />
        </div>
    );
}
