import { ItemDrawContext } from "../Components/ProfilerChart/Internal/ProfilerChartDrawer";

import { Colors as itemColors } from "./Colors";
import { SpanLineItem } from "./SpanLines/SpansToLinesArranger";

let ellipsisWidthCached: number;

function getEllipsisWidth(context: CanvasRenderingContext2D): number {
    if (ellipsisWidthCached == undefined) {
        const ellipsis = "…";
        ellipsisWidthCached = context.measureText(ellipsis).width;
    }
    return ellipsisWidthCached;
}

const strWidths: Map<string, number> = new Map();

function getTextWidth(context: CanvasRenderingContext2D, str: string): number {
    let result = strWidths.get(str);
    if (result == undefined) {
        result = context.measureText(str).width;
        strWidths.set(str, result);
    }
    return result;
}

function fittingString(context: CanvasRenderingContext2D, str: string, maxWidth: number): string {
    let width = getTextWidth(context, str);
    const ellipsis = "…";

    const ellipsisWidth = getEllipsisWidth(context);
    let result = str;
    if (width <= maxWidth || width <= ellipsisWidth) {
        return result;
    }
    let len = result.length;
    while (width >= maxWidth - ellipsisWidth && len-- > 0) {
        result = result.substring(0, len);
        width = getTextWidth(context, result);
    }
    return result + ellipsis;
}

const options = {
    fontSize: 12,
    lineHeight: 15,
    paddingTop: 1,
    paddingLeft: 2,
    paddingRight: 4,
};

export function handleCustomDrawItem(
    context: CanvasRenderingContext2D,
    item: SpanLineItem,
    itemContext: ItemDrawContext
): void {
    context.save();
    try {
        const colorIndex = item.source.status;
        let left = 0;
        let width: number | undefined;
        const fullWidth = itemContext.width;
        const { lineHeight } = itemContext;
        const { selected, hovered } = itemContext.options;

        left = 0;
        width = itemContext.width;
        if (hovered) {
            context.fillStyle = itemColors[colorIndex].hoverBackground;
            context.fillRect(left, 0, width, lineHeight);
        } else {
            context.fillStyle = itemColors[colorIndex].background;
            context.fillRect(left, 0, width, lineHeight);
        }
        if (selected) {
            context.lineWidth = 3;
            context.strokeStyle = itemColors[colorIndex].border;
            context.strokeRect(1.5, 1.5, fullWidth - 3, lineHeight - 3);
        } else {
            context.strokeStyle = itemColors[colorIndex].border;
            context.strokeRect(0.5, 0.5, fullWidth - 1, lineHeight - 1);
        }
        if (width > 50) {
            context.fillStyle = itemColors[colorIndex].text;
            context.font = `${options.fontSize}px Segoe UI`;
            context.fillText(
                fittingString(context, item.source.serviceName, width - (options.paddingLeft + options.paddingRight)),
                left + options.paddingLeft + options.paddingRight,
                options.fontSize + options.paddingTop
            );
        }
    } finally {
        context.restore();
    }
}
