import { TimeRange } from "../Domain/TimeRange";

export class TimeRangeUtils {
    public static isItemIntersectsViewPort<TItem extends TimeRange>(viewPort: TimeRange, item: TItem): boolean {
        return item.to > viewPort.from && item.from < viewPort.to;
    }
}
