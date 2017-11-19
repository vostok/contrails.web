// @flow
import color, { type Color } from "color";
import pixi from "commons/pixi";

import type { ItemDrawContext, ICustomItemDrawer } from "../../components/ProfilerChart/ICustomItemDrawer";
import itemColors from "../Colors";
import type { EnrichedSpanInfo } from "../EnrichedSpanInfo";

import cn from "./CustomItemDrawer.less";

function getColorForPixi(value: Color): [number, number] {
    return [value.red() * 0x10000 + value.green() * 0x100 + value.blue(), value.alpha()];
}

export default class CustomItemDrawer implements ICustomItemDrawer<EnrichedSpanInfo> {
    drawBackground(graphics: pixi.Graphics, item: EnrichedSpanInfo, itemDrawContext: ItemDrawContext) {
        const colorIndex = item.colorConfig;
        graphics.beginFill(...getColorForPixi(color(itemColors[colorIndex].background)));
        graphics.drawRect(
            itemDrawContext.itemLeft,
            itemDrawContext.itemTop,
            itemDrawContext.itemWidth,
            itemDrawContext.itemHeight
        );
        graphics.endFill();
    }

    prepareSelectedItem(node: HTMLDivElement, item: EnrichedSpanInfo, itemDrawContext: ItemDrawContext) {
        node.className = cn("selected-item");
        const colorIndex = item.colorConfig;
        node.style.borderColor = itemColors[colorIndex].border;
        node.style.top = `${itemDrawContext.itemTop}px`;
        node.style.left = `${itemDrawContext.itemLeft}px`;
        node.style.width = `${itemDrawContext.itemWidth}px`;
        node.style.height = `${itemDrawContext.itemHeight}px`;
    }

    prepareTextElement(node: HTMLDivElement, item: EnrichedSpanInfo, itemDrawContext: ItemDrawContext) {
        node.className = cn("item");
        // TODO Fix
        // @flow-disable-next-line
        node.innerText = item.serviceName || "";
        node.style.top = `${itemDrawContext.itemTop}px`;
        node.style.left = `${itemDrawContext.itemLeft}px`;
        node.style.width = `${itemDrawContext.itemWidth}px`;
        node.style.height = `${itemDrawContext.itemHeight}px`;
    }

    updateTextElement(node: HTMLDivElement, item: EnrichedSpanInfo, itemDrawContext: ItemDrawContext) {
        node.style.top = `${itemDrawContext.itemTop}px`;
        node.style.left = `${itemDrawContext.itemLeft}px`;
        node.style.width = `${itemDrawContext.itemWidth}px`;
        node.style.height = `${itemDrawContext.itemHeight}px`;
    }

    prepareHoveredItem(node: HTMLDivElement, item: EnrichedSpanInfo, itemDrawContext: ItemDrawContext) {
        node.className = cn("hovered-item");
        const colorIndex = item.colorConfig;
        node.style.backgroundColor = itemColors[colorIndex].hoverBackground;
        node.style.top = `${itemDrawContext.itemTop}px`;
        node.style.left = `${itemDrawContext.itemLeft}px`;
        node.style.width = `${itemDrawContext.itemWidth}px`;
        node.style.height = `${itemDrawContext.itemHeight}px`;
    }

    updateSelectedItem(node: HTMLDivElement, item: EnrichedSpanInfo, itemDrawContext: ItemDrawContext) {
        node.style.top = `${itemDrawContext.itemTop}px`;
        node.style.left = `${itemDrawContext.itemLeft}px`;
        node.style.width = `${itemDrawContext.itemWidth}px`;
        node.style.height = `${itemDrawContext.itemHeight}px`;
    }

    updateHoveredItem(node: HTMLDivElement, item: EnrichedSpanInfo, itemDrawContext: ItemDrawContext) {
        node.style.top = `${itemDrawContext.itemTop}px`;
        node.style.left = `${itemDrawContext.itemLeft}px`;
        node.style.width = `${itemDrawContext.itemWidth}px`;
        node.style.height = `${itemDrawContext.itemHeight}px`;
    }
}

// const options = {
//     fontSize: 12,
//     lineHeight: 15,
//     smallFontSize: 10,
//     smallLineHeight: 12,
//     paddingTop: 2,
//     iconSize: 12,
//     paddingLeft: 4,
//     paddingRight: 4,
//     iconLeftMargin: 2,
// };

// function handleCustomDrawItem(context: CanvasRenderingContext2D, item: SpanLineItem, itemContext: ItemDrawContext) {
//     context.save();
//     try {
//         const colorIndex = item.colorConfig;
//         const { width } = itemContext;
//         //const { width, lineHeight } = itemContext;
//         // const { selected, hovered } = itemContext.options;
//         // if (hovered) {
//         //     context.fillStyle = itemColors[colorIndex].hoverBackground;
//         //     context.fillRect(0, 0, width, lineHeight);
//         // } else {
//         //     context.fillStyle = itemColors[colorIndex].background;
//         //     context.fillRect(0, 0, width, lineHeight);
//         // }
//         // if (selected) {
//         //     context.lineWidth = 3;
//         //     context.strokeStyle = itemColors[colorIndex].border;
//         //     context.strokeRect(1.5, 1.5, width - 3, lineHeight - 3);
//         // } else {
//         //     context.strokeStyle = itemColors[colorIndex].border;
//         //     context.strokeRect(0.5, 0.5, width - 1, lineHeight - 1);
//         // }

//         if (itemContext.width > 50) {
//             context.drawImage(
//                 DatabaseImage,
//                 0,
//                 0,
//                 DatabaseImage.width,
//                 DatabaseImage.height,
//                 options.paddingTop + 2,
//                 options.paddingTop + 2,
//                 options.iconSize,
//                 options.iconSize
//             );

//             context.fillStyle = itemColors[colorIndex].text;
//             context.font = `${options.fontSize}px Segoe UI`;
//             context.fillText(
//                 fittingString(
//                     context,
//                     (item.source.source.Annotations && item.source.source.Annotations.OriginId) || "",
//                     width - (options.iconSize + options.iconLeftMargin + options.paddingLeft + options.paddingRight)
//                 ),
//                 options.iconSize + options.iconLeftMargin + options.paddingLeft + options.paddingRight,
//                 options.fontSize + options.paddingTop
//             );

//             context.fillStyle = itemColors[colorIndex].text;
//             context.font = `${options.smallFontSize}px Segoe UI`;
//             context.fillText(
//                 fittingString(
//                     context,
//                     (item.source.source.Annotations && item.source.source.Annotations.OriginHost) || "",
//                     width - options.paddingLeft - options.paddingRight
//                 ),
//                 options.paddingLeft + 2,
//                 options.paddingTop + options.lineHeight + options.smallLineHeight
//             );
//         }
//     } finally {
//         context.restore();
//     }
// }
