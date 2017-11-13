// @flow
import pixi from "commons/pixi";
import { InvalidProgramStateError } from "commons/Errors";

import type { ItemDrawContext, ICustomItemDrawer } from "./ICustomItemDrawer";

export type { ItemDrawContext, ICustomItemDrawer };

export type ProfilerItem = {
    from: number,
    to: number,
};

type ProfilerLine<TItem> = {
    items: Array<TItem>,
};

type ItemWithLine<T> = {
    item: T,
    lineIndex: number,
};

export type ProfilerData<TItem: ProfilerItem> = {
    lines: Array<ProfilerLine<TItem>>,
};

type Range = {
    from: number,
    to: number,
};

type Options = {
    backgroundsLayer: HTMLDivElement,
    textLayer: HTMLDivElement,
    selectedLayer: HTMLDivElement,
    hoveredLayer: HTMLDivElement,
    range: Range,
    viewPort: Range,
    width: number,
    height: number,
    xScale: number,
};

const lineHeight = 35;
const lineGap = 1;

export default class ProfilerChartDrawer<T: ProfilerItem> {
    backgroundsLayer: HTMLDivElement;
    textLayer: HTMLDivElement;
    selectedLayer: HTMLDivElement;
    hoveredLayer: HTMLDivElement;
    viewPort: Range;
    range: Range;
    xScale: number;

    pixiApp: pixi.Application;
    pixiGraphics: pixi.Graphics;
    data: ProfilerData<T>;

    textElements: Array<Array<?HTMLDivElement>>;
    textElementsPool: Array<HTMLDivElement> = [];

    hoveredItem: ?ItemWithLine<T>;
    hoveredItemDiv: ?HTMLDivElement;
    selectedItem: ?ItemWithLine<T>;
    selectedItemDiv: ?HTMLDivElement;
    itemDrawer: ICustomItemDrawer<T>;

    constructor(options: Options, data: ProfilerData<T>, itemDrawer: ICustomItemDrawer<T>) {
        this.itemDrawer = itemDrawer;
        this.backgroundsLayer = options.backgroundsLayer;
        this.textLayer = options.textLayer;
        this.selectedLayer = options.selectedLayer;
        this.hoveredLayer = options.hoveredLayer;
        this.range = options.range;
        this.viewPort = options.viewPort;
        this.xScale = options.xScale;

        this.pixiApp = new pixi.Application(options.width, options.height, { transparent: true });
        this.backgroundsLayer.appendChild(this.pixiApp.view);
        this.pixiGraphics = new pixi.Graphics();
        this.data = data;
        this.textElements = data.lines.map(x => x.items.map(() => null));
    }

    toAbsoluteX(itemX: number): number {
        const { xScale, viewPort } = this;
        return (itemX - viewPort.from) * xScale;
    }

    drawBackground() {
        const { data, pixiGraphics, viewPort } = this;

        pixiGraphics.moveTo(0, 0);
        for (let lineIndex = 0; lineIndex < data.lines.length; lineIndex++) {
            const line = data.lines[lineIndex];
            for (let itemIndex = 0; itemIndex < line.items.length; itemIndex++) {
                const item = line.items[itemIndex];
                const left = Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));
                const itemWidth =
                    Math.min(this.toAbsoluteX(viewPort.to) + 1, this.toAbsoluteX(item.to)) -
                    Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));
                this.itemDrawer.drawBackground(pixiGraphics, item, {
                    itemHeight: lineHeight,
                    itemWidth: itemWidth,
                    itemTop: lineIndex * (lineGap + lineHeight),
                    itemLeft: left,
                });
            }
        }
        this.pixiApp.stage.addChild(pixiGraphics);
    }

    updateInteractiveElements() {
        const { viewPort } = this;
        const { selectedItem, selectedItemDiv, hoveredItem, hoveredItemDiv } = this;

        if (selectedItem != null) {
            const { item, lineIndex } = selectedItem;
            if (selectedItemDiv == null) {
                throw new InvalidProgramStateError();
            }
            const node = selectedItemDiv;
            const itemWidth =
                Math.min(this.toAbsoluteX(viewPort.to) + 1, this.toAbsoluteX(item.to)) -
                Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));
            const left = Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));
            this.itemDrawer.updateSelectedItem(node, item, {
                itemLeft: left,
                itemTop: lineIndex * (lineHeight + lineGap),
                itemWidth: itemWidth,
                itemHeight: lineHeight,
            });
        }
        if (hoveredItem != null) {
            const { item, lineIndex } = hoveredItem;
            if (hoveredItemDiv == null) {
                throw new InvalidProgramStateError();
            }
            const node = hoveredItemDiv;
            const itemWidth =
                Math.min(this.toAbsoluteX(viewPort.to) + 1, this.toAbsoluteX(item.to)) -
                Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));
            const left = Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));
            this.itemDrawer.updateHoveredItem(node, item, {
                itemLeft: left,
                itemTop: lineIndex * (lineHeight + lineGap),
                itemWidth: itemWidth,
                itemHeight: lineHeight,
            });
        }
    }

    setHoveredItem(nextHoveredItem: ?ItemWithLine<T>) {
        const { viewPort, hoveredLayer } = this;
        const { hoveredItem, hoveredItemDiv } = this;

        if (nextHoveredItem == null && hoveredItem != null) {
            if (hoveredItemDiv == null) {
                throw new InvalidProgramStateError();
            }
            hoveredLayer.removeChild(hoveredItemDiv);
            this.releaseDivElement(hoveredItemDiv);
            this.hoveredItem = null;
            this.hoveredItemDiv = null;
        }
        if (nextHoveredItem == null || (this.hoveredItem != null && this.hoveredItem.item === nextHoveredItem.item)) {
            return;
        }
        const { item, lineIndex } = nextHoveredItem;

        const node = hoveredItemDiv != null ? hoveredItemDiv : this.acquireDivElement();
        const itemWidth =
            Math.min(this.toAbsoluteX(viewPort.to) + 1, this.toAbsoluteX(item.to)) -
            Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));
        const left = Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));
        this.itemDrawer.prepareHoveredItem(node, nextHoveredItem.item, {
            itemLeft: left,
            itemTop: lineIndex * (lineHeight + lineGap),
            itemWidth: itemWidth,
            itemHeight: lineHeight,
        });
        hoveredLayer.appendChild(node);
        this.hoveredItem = nextHoveredItem;
        this.hoveredItemDiv = node;
    }

    setSelectedItem(nextSelectedItem: ?{ item: T, lineIndex: number }) {
        const { viewPort, selectedLayer } = this;
        const { selectedItem, selectedItemDiv } = this;

        if (nextSelectedItem == null && selectedItem != null) {
            if (selectedItemDiv == null) {
                throw new InvalidProgramStateError();
            }
            selectedLayer.removeChild(selectedItemDiv);
            this.releaseDivElement(selectedItemDiv);
            this.selectedItem = null;
            this.selectedItemDiv = null;
            return;
        }
        if (
            nextSelectedItem == null ||
            (this.selectedItem != null && this.selectedItem.item === nextSelectedItem.item)
        ) {
            return;
        }
        const { item, lineIndex } = nextSelectedItem;

        const node = selectedItemDiv != null ? selectedItemDiv : this.acquireDivElement();
        const itemWidth =
            Math.min(this.toAbsoluteX(viewPort.to) + 1, this.toAbsoluteX(item.to)) -
            Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));
        const left = Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));
        this.itemDrawer.prepareSelectedItem(node, nextSelectedItem.item, {
            itemLeft: left,
            itemTop: lineIndex * (lineHeight + lineGap),
            itemWidth: itemWidth,
            itemHeight: lineHeight,
        });
        selectedLayer.appendChild(node);
        this.selectedItem = nextSelectedItem;
        this.selectedItemDiv = node;
    }

    acquireDivElement(): HTMLDivElement {
        if (this.textElementsPool.length > 0) {
            return this.textElementsPool.pop();
        }
        return (document.createElement("DIV"): any);
    }

    releaseDivElement(element: HTMLDivElement) {
        this.textElementsPool.push(element);
    }

    hideDivElement(lineIndex: number, itemIndex: number) {
        const { textLayer, textElements } = this;
        const node = textElements[lineIndex][itemIndex];
        if (node == null) {
            return;
        }
        textLayer.removeChild(node);
        this.releaseDivElement(node);
        textElements[lineIndex][itemIndex] = null;
    }

    isItemInViewPort(item: T): boolean {
        const { viewPort } = this;
        if (item.from < viewPort.from && item.to < viewPort.from) {
            return false;
        }
        if (item.from > viewPort.to && item.to > viewPort.to) {
            return false;
        }
        return true;
    }

    drawTextElements() {
        const { textLayer, textElements, viewPort, data } = this;
        const newElementsFragment = document.createDocumentFragment();

        for (let lineIndex = 0; lineIndex < data.lines.length; lineIndex++) {
            const line = data.lines[lineIndex];
            for (let itemIndex = 0; itemIndex < line.items.length; itemIndex++) {
                const item = line.items[itemIndex];
                if (!this.isItemInViewPort(item) && textElements[lineIndex][itemIndex] != null) {
                    if (textElements[lineIndex][itemIndex] != null) {
                        this.hideDivElement(lineIndex, itemIndex);
                    }
                    continue;
                }
                const itemWidth =
                    Math.min(this.toAbsoluteX(viewPort.to) + 1, this.toAbsoluteX(item.to)) -
                    Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));
                if (itemWidth <= 50) {
                    if (textElements[lineIndex][itemIndex] != null) {
                        this.hideDivElement(lineIndex, itemIndex);
                    }
                    continue;
                }
                const left = Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));
                if (textElements[lineIndex][itemIndex] != null) {
                    const node = textElements[lineIndex][itemIndex];
                    this.itemDrawer.updateTextElement(node, item, {
                        itemTop: lineIndex * (lineHeight + lineGap),
                        itemLeft: left,
                        itemWidth: itemWidth,
                        itemHeight: lineHeight,
                    });
                } else {
                    const node = this.acquireDivElement();
                    this.itemDrawer.prepareTextElement(node, item, {
                        itemTop: lineIndex * (lineHeight + lineGap),
                        itemLeft: left,
                        itemWidth: itemWidth,
                        itemHeight: lineHeight,
                    });
                    newElementsFragment.appendChild(node);
                    textElements[lineIndex][itemIndex] = node;
                }
            }
        }
        textLayer.appendChild(newElementsFragment);
    }

    updateViewPort(viewPort: Range, xScale: number) {
        this.viewPort = viewPort;
        this.xScale = xScale;
        const { from, to } = this.range;

        this.pixiGraphics.x = this.toAbsoluteX(from);
        this.pixiGraphics.width = this.toAbsoluteX(to) - this.toAbsoluteX(from);
        this.drawTextElements();
        this.updateInteractiveElements();
    }

    finalize() {
        // TODO
    }
}
