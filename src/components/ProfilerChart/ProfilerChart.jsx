// @flow
import * as React from "react";

import generateTimeMarkers from "../../Domain/TimeMarkers";
import type { TimeMarker } from "../../Domain/TimeMarkers";

import cn from "./ProfilerChart.less";

type Color = string;

export type ProfilerItem = {
    from: number,
    to: number,
};

type ProfilerLine<TItem> = {
    items: Array<TItem>,
};

export type ProfilerData<TItem: ProfilerItem> = {
    lines: Array<ProfilerLine<TItem>>,
};

type ItemDrawOptions = {
    hovered: boolean,
    selected: boolean,
};

export type ItemDrawContext = {
    width: number,
    lineHeight: number,
    options: ItemDrawOptions,
};

type ProfilerChartProps<TItem: ProfilerItem> = {|
    data: ProfilerData<TItem>,
    from: number,
    to: number,
    xScale: number,
    viewPort: {
        from: number,
        to: number,
    },
    onItemClick?: (item: TItem, lineIndex: number) => void,
    selectedItems?: TItem[],
    onCustomDrawItem?: (context: CanvasRenderingContext2D, item: TItem, itemDrawContext: ItemDrawContext) => void,
    onCustomDrawItemContent?: (context: CanvasRenderingContext2D, item: TItem) => void,
    onGetBackgroundColor?: (item: TItem) => Color,
|};

const lineHeight = 50;
const lineGap = 1;

function delay(timeout: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}

export default class ProfilerChart<TItem: ProfilerItem> extends React.Component<ProfilerChartProps<TItem>, void> {
    props: ProfilerChartProps<TItem>;
    canvas: ?HTMLCanvasElement = null;
    currentHoveredItem: ?{
        item: TItem,
        lineIndex: number,
    };

    componentDidMount() {
        this.drawData();
    }

    componentDidUpdate() {
        this.drawData();
    }

    toAbsoluteX(itemX: number): number {
        const { xScale, viewPort } = this.props;
        return (itemX - viewPort.from) * xScale;
    }

    toAbsoluteXWihtoutShift(itemX: number): number {
        const { from, xScale } = this.props;
        return (itemX - from) * xScale;
    }

    getBackgroundColor(item: TItem, options: ItemDrawOptions): Color {
        return options.hovered ? "rgba(120, 255, 120, 0.5)" : "rgba(255, 120, 120, 0.5)";
    }

    drawItem(context: CanvasRenderingContext2D, item: TItem, options: ItemDrawOptions) {
        const { viewPort, onCustomDrawItem, onCustomDrawItemContent } = this.props;
        const { from, to } = item;

        const width =
            Math.min(this.toAbsoluteX(viewPort.to) + 1, this.toAbsoluteX(item.to)) -
            Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));

        context.clearRect(0, 0, width, lineHeight);
        if (onCustomDrawItem != null) {
            const itemDrawContext = {
                width: width,
                lineHeight: lineHeight,
                options: options,
            };
            onCustomDrawItem(context, item, itemDrawContext);
        } else {
            context.fillStyle = this.getBackgroundColor(item, options);
            context.fillRect(1, 0, this.toAbsoluteX(to) - this.toAbsoluteX(from) - 2, lineHeight - 1);
            if (onCustomDrawItemContent != null) {
                onCustomDrawItemContent(context, item);
            }
            if (options.selected) {
                context.save();
                context.strokeStyle = "#44f";
                context.lineWidth = 2;
                context.strokeRect(2, 1, this.toAbsoluteX(to) - this.toAbsoluteX(from) - 4, lineHeight - 2 - 1);
                context.restore();
            }
        }
    }

    isItemHovered(item: TItem, lineIndex: number, mouseX: number, mouseY: number): boolean {
        const itemFrom = this.toAbsoluteX(item.from);
        const itemTo = this.toAbsoluteX(item.to);
        const itemTop = lineIndex * (lineHeight + lineGap);
        const itemBottom = (lineIndex + 1) * (lineHeight + lineGap) - lineGap;
        return mouseX > itemFrom && mouseX < itemTo && mouseY > itemTop && mouseY < itemBottom;
    }

    handleMouseLeave = () => {
        const canvas = this.canvas;
        if (canvas == null) {
            return;
        }
        const drawContext = canvas.getContext("2d");
        const currentHoveredItem = this.currentHoveredItem;
        drawContext.save();
        if (currentHoveredItem != null) {
            this.drawItemAtLine(drawContext, currentHoveredItem.item, currentHoveredItem.lineIndex, {
                hovered: false,
                selected: this.isItemSelected(currentHoveredItem.item, currentHoveredItem.lineIndex),
            });
            this.currentHoveredItem = null;
        }
        drawContext.restore();
    };

    isItemSelected(item: TItem, _lineIndex: number): boolean {
        const { selectedItems } = this.props;
        return selectedItems != null && selectedItems.includes(item);
    }

    getItemAtCursor(event: SyntheticMouseEvent<HTMLCanvasElement>): ?{ item: TItem, lineIndex: number } {
        const canvas = this.canvas;
        if (canvas == null) {
            return null;
        }

        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;

        const { data } = this.props;
        for (let lineIndex = 0; lineIndex < data.lines.length; lineIndex++) {
            for (const item of data.lines[lineIndex].items) {
                if (this.isItemHovered(item, lineIndex, mouseX, mouseY)) {
                    return { item: item, lineIndex: lineIndex };
                }
            }
        }
        return null;
    }

    handleMouseClick = (event: SyntheticMouseEvent<HTMLCanvasElement>) => {
        const canvas = this.canvas;
        if (canvas == null) {
            return;
        }
        const { onItemClick } = this.props;
        if (onItemClick != null) {
            const itemAtCursor = this.getItemAtCursor(event);
            if (itemAtCursor != null) {
                onItemClick(itemAtCursor.item, itemAtCursor.lineIndex);
            }
        }
    };

    handleMouseMove = (event: SyntheticMouseEvent<HTMLCanvasElement>) => {
        const canvas = this.canvas;
        if (canvas == null) {
            return;
        }
        const drawContext = canvas.getContext("2d");
        const itemAtCursor = this.getItemAtCursor(event);
        const currentHoveredItem = this.currentHoveredItem;

        if (currentHoveredItem != null && itemAtCursor !== currentHoveredItem.item) {
            this.drawItemAtLine(drawContext, currentHoveredItem.item, currentHoveredItem.lineIndex, {
                hovered: false,
                selected: this.isItemSelected(currentHoveredItem.item, currentHoveredItem.lineIndex),
            });
        }
        if (itemAtCursor != null && (currentHoveredItem == null || itemAtCursor !== currentHoveredItem.item)) {
            this.drawItemAtLine(drawContext, itemAtCursor.item, itemAtCursor.lineIndex, {
                hovered: true,
                selected: this.isItemSelected(itemAtCursor.item, itemAtCursor.lineIndex),
            });
            this.currentHoveredItem = itemAtCursor;
        }
    };

    drawItemAtLine(context: CanvasRenderingContext2D, item: TItem, lineIndex: number, options: ItemDrawOptions) {
        const { viewPort } = this.props;
        context.save();
        try {
            context.translate(
                Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from)),
                lineIndex * (lineHeight + lineGap)
            );
            this.drawItem(context, item, options);
        } finally {
            context.restore();
        }
    }

    newDrawStarted: boolean = false;
    drawing: boolean = false;

    async checkRedraw(): Promise<boolean> {
        await delay(1);
        if (this.newDrawStarted) {
            return true;
        }
        return false;
    }

    setDrawBegin() {
        if (this.drawing) {
            this.newDrawStarted = true;
        } else {
            this.newDrawStarted = false;
        }
        this.drawing = true;
    }

    setDrawFullyCompleted() {
        this.drawing = false;
        this.newDrawStarted = false;
    }

    isItemInViewPort(item: TItem): boolean {
        const { viewPort } = this.props;
        if (item.from < viewPort.from && item.to < viewPort.from) {
            return false;
        }
        if (item.from > viewPort.to && item.to > viewPort.to) {
            return false;
        }
        return true;
    }

    async drawData(): Promise<void> {
        const canvas = this.canvas;
        if (canvas == null) {
            return;
        }

        this.setDrawBegin();
        const { data, from, to } = this.props;
        const width = this.toAbsoluteX(to) - this.toAbsoluteX(from);
        const drawContext = canvas.getContext("2d");

        drawContext.clearRect(0, 0, width, (lineHeight + lineGap) * data.lines.length);

        drawContext.save();
        let drawedCount = 0;
        try {
            for (let lineIndex = 0; lineIndex < data.lines.length; lineIndex++) {
                const line = data.lines[lineIndex];
                for (const item of line.items) {
                    if (!this.isItemInViewPort(item)) {
                        continue;
                    }
                    this.drawItemAtLine(drawContext, item, lineIndex, {
                        hovered: false,
                        selected: this.isItemSelected(item, lineIndex),
                    });
                    drawedCount++;
                    if (drawedCount === 500) {
                        console.log(500);
                        drawedCount = 0;
                        // eslint-disable-next-line max-depth
                        if (await this.checkRedraw()) {
                            this.newDrawStarted = false;
                            return;
                        }
                    }
                }
            }
            this.setDrawFullyCompleted();
        } finally {
            drawContext.restore();
        }
    }

    generateTimeMarkers(): TimeMarker[] {
        const { from, xScale, viewPort } = this.props;
        return generateTimeMarkers(viewPort.from - from, viewPort.to - from, 100 / xScale).map(x => ({
            ...x,
            value: x.value + from,
        }));
    }

    renderTimeMarkers(): React.Node {
        const timeMarkers = this.generateTimeMarkers();
        return (
            <div className={cn("time-markers-container")}>
                {timeMarkers.map(timeMarker =>
                    <div
                        className={cn("time-marker")}
                        key={timeMarker.value}
                        style={{ left: this.toAbsoluteX(timeMarker.value) }}>
                        <div className={cn("time-marker-title")}>
                            {timeMarker.title}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    render(): React.Node {
        const { viewPort, data } = this.props;
        return (
            <div style={{ position: "relative", zIndex: 0 }}>
                <div style={{ position: "relative", height: 20 }} />
                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                    }}>
                    <canvas
                        style={{
                            position: "relative",
                        }}
                        width={this.toAbsoluteX(viewPort.to) - this.toAbsoluteX(viewPort.from)}
                        ref={e => (this.canvas = e)}
                        onClick={this.handleMouseClick}
                        onMouseMove={this.handleMouseMove}
                        onMouseLeave={this.handleMouseLeave}
                        height={(lineHeight + lineGap) * data.lines.length}
                    />
                </div>
                {this.renderTimeMarkers()}
            </div>
        );
    }
}
