import * as React from "react";

import { generateTimeMarkers, TimeMarker } from "../../Domain/TimeMarkers";
import { TimeRange } from "../../Domain/TimeRange";

import cn from "./TimeMarkersBackground.less";

interface TimeMarkersBackgroundProps {
    timeRange: TimeRange;
    width: number;
    viewPort: TimeRange;
    fontSize: number;
    titleHeight: number;
}

export function TimeMarkersBackground(props: TimeMarkersBackgroundProps): JSX.Element {
    function toAbsoluteX(itemX: number): number {
        const { width, viewPort } = props;
        return (itemX - viewPort.from) * (width / (viewPort.to - viewPort.from));
    }

    function generateTimeMarkersLocal(): TimeMarker[] {
        const { timeRange, width, viewPort } = props;
        return generateTimeMarkers(
            viewPort.from - timeRange.from,
            viewPort.to - timeRange.from,
            (viewPort.to - viewPort.from) * (100 / width)
        ).map(x => ({
            ...x,
            value: x.value + timeRange.from,
        }));
    }

    const timeMarkers = generateTimeMarkersLocal();

    return (
        <div className={cn("time-markers-container")}>
            {timeMarkers.map(timeMarker => (
                <div
                    className={cn("time-marker")}
                    key={timeMarker.value}
                    style={{ left: toAbsoluteX(timeMarker.value) }}>
                    <div
                        className={cn("time-marker-title")}
                        style={{ fontSize: props.fontSize, lineHeight: `${props.titleHeight}px` }}>
                        {timeMarker.title}
                    </div>
                </div>
            ))}
        </div>
    );
}
