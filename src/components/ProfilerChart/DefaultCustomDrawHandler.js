// @flow
import type { ProfilerItem, ItemDrawContext } from "./ProfilerChart";

export default function defaultCustomDrawHandler<TItem: ProfilerItem>(
    context: CanvasRenderingContext2D,
    item: TItem,
    itemDrawContext: ItemDrawContext
) {
    const { width, lineHeight, options: { hovered, selected } } = itemDrawContext;

    context.fillStyle = hovered ? "rgba(120, 255, 120, 0.5)" : "rgba(255, 120, 120, 0.5)";
    context.fillRect(1, 0, width - 2, lineHeight - 1);
    if (selected) {
        context.save();
        context.strokeStyle = "#44f";
        context.lineWidth = 2;
        context.strokeRect(2, 1, width - 4, lineHeight - 2 - 1);
        context.restore();
    }
}
