// @flow
import pixi from "commons/pixi";

export type Rect = {
    top: number,
    left: number,
    width: number,
    height: number,
};

export type ItemDrawContext = {
    itemHeight: number,
    itemWidth: number,
    itemLeft: number,
    itemTop: number,
    adjustRect: ({ from: number, to: number }) => Rect,
};

export interface ICustomItemDrawer<T> {
    drawBackground(graphics: pixi.Graphics, item: T, itemDrawContext: ItemDrawContext): void;
    prepareSelectedItem(node: HTMLDivElement, item: T, itemDrawContext: ItemDrawContext): void;
    prepareTextElement(node: HTMLDivElement, item: T, itemDrawContext: ItemDrawContext): void;
    updateTextElement(node: HTMLDivElement, item: T, itemDrawContext: ItemDrawContext): void;
    prepareHoveredItem(node: HTMLDivElement, item: T, itemDrawContext: ItemDrawContext): void;
    updateSelectedItem(node: HTMLDivElement, item: T, itemDrawContext: ItemDrawContext): void;
    updateHoveredItem(node: HTMLDivElement, item: T, itemDrawContext: ItemDrawContext): void;
}
