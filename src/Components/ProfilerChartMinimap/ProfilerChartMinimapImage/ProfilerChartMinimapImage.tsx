import { TimeRange } from "../../../Domain/TimeRange";
import * as React from "react";
import { emptyRef } from "../../../Commons/TypingHacks";
import { MinimapChartData } from "../MinimapChartData";

interface ProfilerChartMinimapImageProps {
    timeRange: TimeRange;
    data: MinimapChartData;
    width: number;
    height: number;
}

export function ProfilerChartMinimapImage({timeRange, data, width, height}: ProfilerChartMinimapImageProps): JSX.Element {
    const canvas = React.useRef<HTMLCanvasElement>(emptyRef);

    function toAbsoluteX(value: number): number {
        return ((value - timeRange.from) * width) / (timeRange.to - timeRange.from);
    }

    React.useEffect(() => {
        if (canvas.current == undefined) {
            return undefined;
        }
        const context = canvas.current.getContext("2d");
        if (context == undefined) {
            return undefined;
        }

        context.save();
        try {
            context.clearRect(0, 0, width, height);
            const lineHeight = 5;

            let lineIndex = 0;
            for (const line of data.lines) {
                for (const item of line.items) {
                    context.fillStyle = item.color || "rgba(30, 121, 190, 0.50)";
                    context.strokeStyle = "rgba(30, 121, 190, 1.0)";
                    context.lineWidth = 0.5;
                    context.fillRect(
                        toAbsoluteX(item.from),
                        lineIndex * lineHeight,
                        toAbsoluteX(item.to) - toAbsoluteX(item.from),
                        lineHeight
                    );
                    context.strokeRect(
                        toAbsoluteX(item.from),
                        lineIndex * lineHeight,
                        toAbsoluteX(item.to) - toAbsoluteX(item.from),
                        lineHeight
                    );
                }
                lineIndex++;
            }
        } finally {
            context.restore();
        }
        return undefined;
    }, [data, width, height]);

    return <canvas ref={canvas} height={height} width={width}/>;
}
