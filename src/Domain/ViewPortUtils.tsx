import { TimeRange } from "./TimeRange";

export class ViewPortUtils {
    public static offset(timeRange: TimeRange, viewPort: TimeRange, viewPortOffset: number): TimeRange {
        const { from, to } = timeRange;

        if (viewPortOffset < 0) {
            const newFrom = Math.max(from, viewPort.from + viewPortOffset);
            const newTo = newFrom + viewPort.to - viewPort.from;
            return {
                from: newFrom,
                to: newTo,
            };
        } else if (viewPortOffset > 0) {
            const newTo = Math.min(to, viewPort.to + viewPortOffset);
            const newFrom = newTo - (viewPort.to - viewPort.from);
            return {
                from: newFrom,
                to: newTo,
            };
        }
        return viewPort;
    }

    public static zoom(timeRange: TimeRange, viewPort: TimeRange, spinY: number, zoomCenter: number): TimeRange {
        const scalePercentage = 0.2;

        const { from: maxFrom, to: maxTo } = timeRange;
        const { from, to } = viewPort;

        const viewPortScale = Math.pow(scalePercentage * Math.sign(spinY) + 1, Math.abs(spinY));
        const viewPortWidth = to - from;
        const nextViewPortWidth = Math.max(viewPortWidth * viewPortScale, 1);

        let nextFrom = zoomCenter - (nextViewPortWidth * (zoomCenter - from)) / viewPortWidth;
        let nextTo = zoomCenter + (nextViewPortWidth * (to - zoomCenter)) / viewPortWidth;

        if (nextFrom < maxFrom && nextTo > maxTo) {
            nextFrom = maxFrom;
            nextTo = maxTo;
        } else if (nextFrom < maxFrom) {
            nextFrom = maxFrom;
            nextTo = maxFrom + nextViewPortWidth;
        } else if (nextTo > maxTo) {
            nextFrom = maxTo - nextViewPortWidth;
            nextTo = maxTo;
        }
        return {
            from: nextFrom,
            to: nextTo,
        };
    }
}
