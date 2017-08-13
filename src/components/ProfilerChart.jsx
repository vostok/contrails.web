// @flow
import React from "react";

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

type ProfilerChartProps<TItem: ProfilerItem> = {|
    data: ProfilerData<TItem>,
    from: number,
    to: number,
    xScale: number,

    onItemClick?: (event: SyntheticMouseEvent, item: TItem, lineIndex: number) => void,
    selectedItems?: TItem[],
    onCustomDrawItem?: (context: CanvasRenderingContext2D, item: TItem) => void,
    onGetBackgroundColor?: (item: TItem) => Color,
|};

const lineHeight = 50;

type ItemDrawOptions = {
    hovered: boolean,
    selected: boolean,
};

function delay(timeout: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}

export default class ProfilerChart<TItem: ProfilerItem> extends React.Component<void, ProfilerChartProps<TItem>, void> {
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

    toAbsolute(itemX: number): number {
        const { xScale } = this.props;
        return itemX * xScale;
    }

    getBackgroundColor(item: TItem, options: ItemDrawOptions): Color {
        return options.hovered ? "#5f5" : "#f55";
    }

    drawItem(context: CanvasRenderingContext2D, item: TItem, options: ItemDrawOptions) {
        const { onCustomDrawItem } = this.props;
        const { from, to } = item;

        context.fillStyle = this.getBackgroundColor(item, options);
        context.fillRect(1, 0, this.toAbsolute(to - from) - 2, lineHeight - 1);
        if (onCustomDrawItem != null) {
            onCustomDrawItem(context, item);
        }
        if (options.selected) {
            context.save();
            context.strokeStyle = "#44f";
            context.lineWidth = 2;
            context.strokeRect(2, 1, this.toAbsolute(to - from) - 4, lineHeight - 2 - 1);
            context.restore();
        }
    }

    isItemHovered(item: TItem, lineIndex: number, mouseX: number, mouseY: number): boolean {
        const itemFrom = this.toAbsolute(item.from);
        const itemTo = this.toAbsolute(item.to);
        const itemTop = lineIndex * lineHeight;
        const itemBottom = (lineIndex + 1) * lineHeight;
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

    getItemAtCursor(event: SyntheticMouseEvent): ?{ item: TItem, lineIndex: number } {
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

    handleMouseClick = (event: SyntheticMouseEvent) => {
        const canvas = this.canvas;
        if (canvas == null) {
            return;
        }
        const { onItemClick } = this.props;
        if (onItemClick != null) {
            const itemAtCursor = this.getItemAtCursor(event);
            if (itemAtCursor != null) {
                onItemClick(event, itemAtCursor.item, itemAtCursor.lineIndex);
            }
        }
    };

    handleMouseMove = (event: SyntheticMouseEvent) => {
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
        context.save();
        try {
            context.translate(this.toAbsolute(item.from), lineIndex * lineHeight);
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

    async drawData(): Promise<void> {
        const canvas = this.canvas;
        if (canvas == null) {
            return;
        }

        this.setDrawBegin();
        const { data, from, to } = this.props;
        const width = this.toAbsolute(to - from);
        const drawContext = canvas.getContext("2d");

        drawContext.fillStyle = "#eee";
        drawContext.fillRect(0, 0, width, lineHeight * data.lines.length);

        drawContext.save();
        let drawedCount = 0;
        try {
            for (let lineIndex = 0; lineIndex < data.lines.length; lineIndex++) {
                const line = data.lines[lineIndex];
                for (const item of line.items) {
                    this.drawItemAtLine(drawContext, item, lineIndex, {
                        hovered: false,
                        selected: this.isItemSelected(item, lineIndex),
                    });
                    drawedCount++;
                    if (drawedCount === 500) {
                        drawedCount = 0;
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

    render(): React.Element<*> {
        const { to, from, data } = this.props;
        return (
            <canvas
                ref={(e: HTMLCanvasElement) => (this.canvas = e)}
                onClick={this.handleMouseClick}
                onMouseMove={this.handleMouseMove}
                onMouseLeave={this.handleMouseLeave}
                height={lineHeight * data.lines.length}
                width={this.toAbsolute(to - from)}
            />
        );
    }
}
