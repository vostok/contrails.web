// @flow
import color, { type Color } from "color";
import pixi from "commons/pixi";

import type { ItemDrawContext, ICustomItemDrawer } from "./ProfilerChartDrawer";
import cn from "./DefaultCustomItemDrawer.less";

function getColorForPixi(value: Color): [number, number] {
    return [value.red() * 0x10000 + value.green() * 0x100 + value.blue(), value.alpha()];
}

export default class DefaultCustomItemDrawer<T> implements ICustomItemDrawer<T> {
    drawBackground(graphics: pixi.Graphics, item: T, itemDrawContext: ItemDrawContext) {
        graphics.beginFill(...getColorForPixi(color("rgba(255, 120, 120, 0.5)")));
        graphics.drawRect(
            itemDrawContext.itemLeft,
            itemDrawContext.itemTop,
            itemDrawContext.itemWidth,
            itemDrawContext.itemHeight
        );
        graphics.endFill();
    }

    prepareSelectedItem(node: HTMLDivElement, item: T, itemDrawContext: ItemDrawContext) {
        node.className = cn("selected-item");
        node.style.top = `${itemDrawContext.itemTop}px`;
        node.style.left = `${itemDrawContext.itemLeft}px`;
        node.style.width = `${itemDrawContext.itemWidth}px`;
        node.style.height = `${itemDrawContext.itemHeight}px`;
    }

    prepareTextElement(node: HTMLDivElement, item: T, itemDrawContext: ItemDrawContext) {
        node.className = cn("item");
        node.innerText = "Item";
        node.style.top = `${itemDrawContext.itemTop}px`;
        node.style.left = `${itemDrawContext.itemLeft}px`;
        node.style.width = `${itemDrawContext.itemWidth}px`;
        node.style.height = `${itemDrawContext.itemHeight}px`;
    }

    updateTextElement(node: HTMLDivElement, item: T, itemDrawContext: ItemDrawContext) {
        node.style.top = `${itemDrawContext.itemTop}px`;
        node.style.left = `${itemDrawContext.itemLeft}px`;
        node.style.width = `${itemDrawContext.itemWidth}px`;
        node.style.height = `${itemDrawContext.itemHeight}px`;
    }

    prepareHoveredItem(node: HTMLDivElement, item: T, itemDrawContext: ItemDrawContext) {
        node.className = cn("hovered-item");
        node.style.top = `${itemDrawContext.itemTop}px`;
        node.style.left = `${itemDrawContext.itemLeft}px`;
        node.style.width = `${itemDrawContext.itemWidth}px`;
        node.style.height = `${itemDrawContext.itemHeight}px`;
    }

    updateSelectedItem(node: HTMLDivElement, item: T, itemDrawContext: ItemDrawContext) {
        node.style.top = `${itemDrawContext.itemTop}px`;
        node.style.left = `${itemDrawContext.itemLeft}px`;
        node.style.width = `${itemDrawContext.itemWidth}px`;
        node.style.height = `${itemDrawContext.itemHeight}px`;
    }
    updateHoveredItem(node: HTMLDivElement, item: T, itemDrawContext: ItemDrawContext) {
        node.style.top = `${itemDrawContext.itemTop}px`;
        node.style.left = `${itemDrawContext.itemLeft}px`;
        node.style.width = `${itemDrawContext.itemWidth}px`;
        node.style.height = `${itemDrawContext.itemHeight}px`;
    }
}


//    const { width, lineHeight, options: { hovered, selected } } = itemDrawContext;
//
//    if (item.serverRange != null) {
//        const serverRect = itemDrawContext.adjustRect(item.serverRange);
//
//        context.fillStyle = hovered ? "rgba(164, 164, 164, 0.5)" : "rgba(164, 164, 164, 0.8)";
//        context.fillRect(1, 0, serverRect.left, lineHeight - 1);
//        context.fillRect(
//            serverRect.left + serverRect.width,
//            0,
//            width - (serverRect.left + serverRect.width) - 2,
//            lineHeight - 1
//        );
//
//        context.fillStyle = hovered ? "rgba(120, 255, 120, 0.5)" : "rgba(255, 120, 120, 0.5)";
//        context.fillRect(serverRect.left, 0, serverRect.width, lineHeight - 1);
//    } else {
//        context.fillStyle = hovered ? "rgba(120, 255, 120, 0.5)" : "rgba(255, 120, 120, 0.5)";
//        context.fillRect(1, 0, width - 2, lineHeight - 1);
//    }