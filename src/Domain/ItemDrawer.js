// @flow
import DatabaseIcon from "../components/Icons/db.png";
import HTTPIcon from "../components/Icons/http.png";
import ServiceIcon from "../components/Icons/service.png";
import type { ItemDrawContext } from "../components/ProfilerChart/ProfilerChart";

import type { SpanLineItem } from "./SpanLines/SpansToLinesArranger";
import itemColors from "./Colors";

const DatabaseImage = new Image(14, 14);
DatabaseImage.src = DatabaseIcon;

const HTTPImage = new Image(14, 14);
HTTPImage.src = HTTPIcon;

const ServiceImage = new Image(14, 14);
ServiceImage.src = ServiceIcon;

type ItemDrawOptions = {
    hovered: boolean,
    selected: boolean,
};

function fittingString(context: CanvasRenderingContext2D, str: string, maxWidth: number): string {
    let width = context.measureText(str).width;
    const ellipsis = "…";
    const ellipsisWidth = context.measureText(ellipsis).width;
    let result = str;
    if (width <= maxWidth || width <= ellipsisWidth) {
        return result;
    }
    let len = result.length;
    while (width >= maxWidth - ellipsisWidth && len-- > 0) {
        result = result.substring(0, len);
        width = context.measureText(result).width;
    }
    return result + ellipsis;
}

const options = {
    fontSize: 12,
    lineHeight: 15,
    smallFontSize: 10,
    smallLineHeight: 12,
    paddingTop: 2,
    iconSize: 12,
    paddingLeft: 4,
    paddingRight: 4,
    iconLeftMargin: 2,
};

function getImage(item: SpanLineItem): mixed {
    const name = item.source.serviceName;
    const OriginId = name;
    if (typeof OriginId === "string" && (OriginId.startsWith("Billy") || OriginId.startsWith("Billing"))) {
        return ServiceImage;
    }
    if (typeof OriginId === "string" && OriginId.startsWith("Web.UI")) {
        return HTTPImage;
    }
    if (typeof OriginId === "string" && OriginId.includes("Zebra")) {
        return DatabaseImage;
    }
    return ServiceImage;
}

export default function handleCustomDrawItem(
    context: CanvasRenderingContext2D,
    item: SpanLineItem,
    itemContext: ItemDrawContext
) {
    context.save();
    try {
        const colorIndex = item.source.colorConfig;
        let left = 0;
        let width = null;
        const fullWidth = itemContext.width;
        const { lineHeight } = itemContext;
        const { selected, hovered } = itemContext.options;

        if (item.source.type === "RemoteCallSpan") {
            ({ left, width } = itemContext.adjustRect(item.source.serverRange));

            context.fillStyle = hovered ? "rgba(164, 164, 164, 0.5)" : "rgba(164, 164, 164, 0.8)";
            context.fillRect(1, 0, left - 1, lineHeight - 1);
            context.fillRect(left + width, 0, fullWidth - (left + width) - 2, lineHeight - 1);
        } else {
            left = 0;
            width = itemContext.width;
        }
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
        const image = getImage(item);
        if (width > 50) {
            context.drawImage(
                image,
                0,
                0,
                image.width,
                image.height,
                left + options.paddingTop + 2,
                options.paddingTop + 2,
                options.iconSize,
                options.iconSize
            );

            context.fillStyle = itemColors[colorIndex].text;
            context.font = `${options.fontSize}px Segoe UI`;
            context.fillText(
                fittingString(
                    context,
                    item.source.serviceName,
                    width - (options.iconSize + options.iconLeftMargin + options.paddingLeft + options.paddingRight)
                ),
                left + options.iconSize + options.iconLeftMargin + options.paddingLeft + options.paddingRight,
                options.fontSize + options.paddingTop
            );

            context.fillStyle = itemColors[colorIndex].text;
            context.font = `${options.smallFontSize}px Segoe UI`;
            context.fillText(
                fittingString(context, item.source.spanTitle || "", width - options.paddingLeft - options.paddingRight),
                left + options.paddingLeft + 2,
                options.paddingTop + options.lineHeight + options.smallLineHeight
            );
        }
    } finally {
        context.restore();
    }
}
