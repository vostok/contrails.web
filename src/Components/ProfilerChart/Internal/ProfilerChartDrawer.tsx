import * as React from "react";

import { InvalidProgramStateError } from "../../../Commons/Errors";
import { TimeRange } from "../../../Domain/TimeRange";
import { TimeRangeUtils } from "../../../Store/TimeRangeUtils";

import { IInterruptibleContext, interruptible } from "./AsyncInterruptible";

interface ProfilerLine<TItem> {
    items: TItem[];
}

export interface ProfilerData<TItem extends TimeRange> {
    lines: Array<ProfilerLine<TItem>>;
}

export interface ItemDrawOptions {
    hovered: boolean;
    selected: boolean;
}

export interface ItemDrawContext {
    width: number;
    lineHeight: number;
    options: ItemDrawOptions;
    itemPositionToAbsolute: (x: number) => number;
    adjustRect: (x: TimeRange) => { width: number; left: number };
}

export const lineHeight = 17;
export const lineGap = 1;

export type CustomDrawHandler<TItem extends TimeRange> = (
    context: CanvasRenderingContext2D,
    item: TItem,
    itemDrawContext: ItemDrawContext
) => void;

export class ProfilerChartDrawer<TItem extends TimeRange> {
    private readonly data: ProfilerData<TItem>;
    private readonly onCustomDrawItem: CustomDrawHandler<TItem>;
    private readonly drawContext: CanvasRenderingContext2D;
    private readonly canvas: HTMLCanvasElement;

    private width: number;
    private viewPort: TimeRange;
    private selectedItems?: TItem[];
    private currentHoveredItem?: {
        item: TItem;
        lineIndex: number;
    };

    public readonly drawData: () => Promise<void>;

    public constructor(
        canvas: HTMLCanvasElement,
        data: ProfilerData<TItem>,
        width: number,
        viewPort: TimeRange,
        onCustomDrawItem: CustomDrawHandler<TItem>
    ) {
        this.canvas = canvas;
        const drawContext = canvas.getContext("2d");
        if (drawContext == undefined) {
            throw new InvalidProgramStateError();
        }
        this.drawContext = drawContext;
        this.data = data;
        this.width = width;
        this.viewPort = viewPort;
        this.onCustomDrawItem = onCustomDrawItem;
        this.drawData = interruptible(this.drawDataInternal);
    }

    public updateViewPort(width: number, viewPort: TimeRange): void {
        this.width = width;
        this.viewPort = viewPort;
    }

    public setSelectedItems(selectedItems?: TItem[]): void {
        this.selectedItems = selectedItems;
    }

    public handleChangeHoveredItem(nextHoveredItem: undefined | { item: TItem; lineIndex: number }): void {
        const prevHoveredItem = this.currentHoveredItem;
        if (
            prevHoveredItem != undefined &&
            (nextHoveredItem == undefined || nextHoveredItem.item !== prevHoveredItem.item)
        ) {
            this.drawItemAtLine(prevHoveredItem.item, prevHoveredItem.lineIndex, {
                hovered: false,
                selected: this.isItemSelected(prevHoveredItem.item, prevHoveredItem.lineIndex),
            });
        }
        if (
            nextHoveredItem != undefined &&
            (prevHoveredItem == undefined || nextHoveredItem.item !== prevHoveredItem.item)
        ) {
            this.drawItemAtLine(nextHoveredItem.item, nextHoveredItem.lineIndex, {
                hovered: true,
                selected: this.isItemSelected(nextHoveredItem.item, nextHoveredItem.lineIndex),
            });
        }
        this.currentHoveredItem = nextHoveredItem;
    }

    public getItemAtCursor(event: React.MouseEvent<HTMLCanvasElement>): undefined | { item: TItem; lineIndex: number } {
        const canvas = this.canvas;
        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;

        const data = this.data;
        for (let lineIndex = 0; lineIndex < data.lines.length; lineIndex++) {
            if (
                mouseY <= lineIndex * (lineHeight + lineGap) ||
                mouseY >= (lineIndex + 1) * (lineHeight + lineGap) - lineGap
            ) {
                continue;
            }
            for (const item of data.lines[lineIndex].items) {
                if (this.isItemHovered(item, lineIndex, mouseX, mouseY)) {
                    return { item: item, lineIndex: lineIndex };
                }
            }
        }
        return undefined;
    }

    private isItemHovered(item: TItem, lineIndex: number, mouseX: number, mouseY: number): boolean {
        const itemFrom = this.toAbsoluteX(item.from);
        const itemTo = this.toAbsoluteX(item.to);
        const itemTop = lineIndex * (lineHeight + lineGap);
        const itemBottom = (lineIndex + 1) * (lineHeight + lineGap) - lineGap;
        return mouseX > itemFrom && mouseX < itemTo && mouseY > itemTop && mouseY < itemBottom;
    }

    private readonly drawDataInternal = (interruptibleContext: IInterruptibleContext) => async (): Promise<void> => {
        this.drawContext.clearRect(0, 0, this.width, (lineHeight + lineGap) * this.data.lines.length);
        this.drawContext.save();
        try {
            for (let lineIndex = 0; lineIndex < this.data.lines.length; lineIndex++) {
                const line = this.data.lines[lineIndex];
                for (const item of line.items) {
                    if (!TimeRangeUtils.isItemIntersectsViewPort(this.viewPort, item)) {
                        continue;
                    }
                    this.drawItemAtLine(item, lineIndex, {
                        hovered: false,
                        selected: this.isItemSelected(item, lineIndex),
                    });
                    await interruptibleContext.check();
                }
            }
        } finally {
            this.drawContext.restore();
        }
    };

    private drawItem(item: TItem, options: ItemDrawOptions): void {
        const itemWidth =
            Math.min(this.toAbsoluteX(this.viewPort.to) + 1, this.toAbsoluteX(item.to)) -
            Math.max(this.toAbsoluteX(this.viewPort.from) - 1, this.toAbsoluteX(item.from));

        this.drawContext.clearRect(0, 0, itemWidth, lineHeight);
        const itemDrawContext: ItemDrawContext = {
            width: itemWidth,
            lineHeight: lineHeight,
            options: options,
            itemPositionToAbsolute: value => this.toAbsoluteX(value) - this.toAbsoluteX(this.viewPort.from),
            adjustRect: rect => ({
                width:
                    Math.min(this.toAbsoluteX(this.viewPort.to) + 1, this.toAbsoluteX(rect.to)) -
                    Math.max(this.toAbsoluteX(this.viewPort.from) - 1, this.toAbsoluteX(rect.from)),
                left: Math.max(
                    0,
                    this.toAbsoluteX(rect.from) -
                        Math.max(this.toAbsoluteX(this.viewPort.from) - 1, this.toAbsoluteX(item.from))
                ),
            }),
        };
        this.onCustomDrawItem(this.drawContext, item, itemDrawContext);
    }

    private isItemSelected(item: TItem, _lineIndex: number): boolean {
        const selectedItems = this.selectedItems;
        return selectedItems != undefined && selectedItems.includes(item);
    }

    private drawItemAtLine(item: TItem, lineIndex: number, options: ItemDrawOptions): void {
        this.drawContext.save();
        try {
            this.drawContext.translate(
                Math.max(this.toAbsoluteX(this.viewPort.from) - 1, this.toAbsoluteX(item.from)),
                lineIndex * (lineHeight + lineGap)
            );
            this.drawItem(item, options);
        } finally {
            this.drawContext.restore();
        }
    }

    private toAbsoluteX(itemX: number): number {
        const viewPort = this.viewPort;
        return ((itemX - viewPort.from) * this.width) / (viewPort.to - viewPort.from);
    }
}
