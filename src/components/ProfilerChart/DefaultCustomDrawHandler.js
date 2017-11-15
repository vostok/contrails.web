// @flow
import type { ProfilerItem, ItemDrawContext } from "./ProfilerChart";

export default function defaultCustomDrawHandler<TItem: ProfilerItem>(
    context: CanvasRenderingContext2D,
    item: TItem,
    itemDrawContext: ItemDrawContext
) {
    const { width, lineHeight, options: { hovered, selected } } = itemDrawContext;

    if (item.serverRange != null) {
        const serverRect = itemDrawContext.adjustRect(item.serverRange);

        context.fillStyle = hovered ? "rgba(164, 164, 164, 0.5)" : "rgba(164, 164, 164, 0.8)";
        context.fillRect(1, 0, serverRect.left, lineHeight - 1);
        context.fillRect(
            serverRect.left + serverRect.width,
            0,
            width - (serverRect.left + serverRect.width) - 2,
            lineHeight - 1
        );

        context.fillStyle = hovered ? "rgba(120, 255, 120, 0.5)" : "rgba(255, 120, 120, 0.5)";
        context.fillRect(serverRect.left, 0, serverRect.width, lineHeight - 1);
    } else {
        context.fillStyle = hovered ? "rgba(120, 255, 120, 0.5)" : "rgba(255, 120, 120, 0.5)";
        context.fillRect(1, 0, width - 2, lineHeight - 1);
    }
    if (selected) {
        context.save();
        context.strokeStyle = "#44f";
        context.lineWidth = 2;
        context.strokeRect(2, 1, width - 4, lineHeight - 2 - 1);
        context.restore();
    }
}
