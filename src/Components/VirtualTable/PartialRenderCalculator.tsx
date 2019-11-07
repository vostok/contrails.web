import { RowRange } from "./RowRange";

const additionalRowCountToRender = 40;

export class PartialRenderCalculator {
    public static getVisibleRowRange(
        containerHeight: number,
        containerScrollTop: number,
        rowCount: number,
        rowHeight: number
    ): RowRange {
        const scrollTop = containerScrollTop;
        const rowsPerScreen = Math.ceil(containerHeight / rowHeight);
        const firstVisibleRowIndex = Math.min(rowCount - rowsPerScreen, Math.max(0, Math.floor(scrollTop / rowHeight)));
        return {
            from: firstVisibleRowIndex,
            to: Math.min(rowCount, firstVisibleRowIndex + rowsPerScreen),
        };
    }

    public static getScrollPositionForItem(
        containerHeight: number,
        containerScrollTop: number,
        rowCount: number,
        rowHeight: number,
        itemIndex: number
    ): undefined | number {
        const visibleRowRange = this.getVisibleRowRange(containerHeight, containerScrollTop, rowCount, rowHeight);
        const focusedIndex = itemIndex;
        const viewPortHeight = containerHeight;

        if (visibleRowRange.from > focusedIndex) {
            return focusedIndex * rowHeight;
        } else if (visibleRowRange.to <= focusedIndex) {
            return Math.max(0, focusedIndex * rowHeight - viewPortHeight + rowHeight);
        }
        return undefined;
    }

    public static getRowRangeToRender(
        containerHeight: number,
        containerScrollTop: number,
        rowCount: number,
        rowHeight: number
    ): RowRange {
        const rowsPerScreen = Math.ceil(containerHeight / rowHeight);
        const firstVisibleRowIndex = Math.min(
            rowCount - rowsPerScreen,
            Math.max(0, Math.floor(containerScrollTop / rowHeight))
        );
        return {
            from: Math.max(0, firstVisibleRowIndex - additionalRowCountToRender),
            to: Math.min(rowCount, firstVisibleRowIndex + rowsPerScreen + additionalRowCountToRender),
        };
    }
}
