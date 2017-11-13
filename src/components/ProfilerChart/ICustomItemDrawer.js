// @flow
import pixi from "commons/pixi";

export type ItemDrawContext = {
    itemHeight: number,
    itemWidth: number,
    itemLeft: number,
    itemTop: number,
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
