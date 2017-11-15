// @flow
import * as React from "react";

import generateTimeMarkers from "../../Domain/TimeMarkers";
import type { TimeMarker } from "../../Domain/TimeMarkers";

import defaultCustomDrawHandler from "./DefaultCustomDrawHandler";
import type { IInterruptibleContext } from "./AsyncInterruptible";
import { interruptible } from "./AsyncInterruptible";
import cn from "./ProfilerChart.less";

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
    itemPositionToAbsolute: number => number,
    adjustRect: ({ from: number, to: number }) => { width: number, left: number },
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
    onCustomDrawItem: (context: CanvasRenderingContext2D, item: TItem, itemDrawContext: ItemDrawContext) => void,
|};

const lineHeight = 35;
const lineGap = 1;

export default class ProfilerChart<TItem: ProfilerItem> extends React.Component<ProfilerChartProps<TItem>, void> {
    props: ProfilerChartProps<TItem>;
    canvas: ?HTMLCanvasElement = null;
    static defaultProps = {
        onCustomDrawItem: defaultCustomDrawHandler,
    };
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

    isItemHovered(item: TItem, lineIndex: number, mouseX: number, mouseY: number): boolean {
        const itemFrom = this.toAbsoluteX(item.from);
        const itemTo = this.toAbsoluteX(item.to);
        const itemTop = lineIndex * (lineHeight + lineGap);
        const itemBottom = (lineIndex + 1) * (lineHeight + lineGap) - lineGap;
        return mouseX > itemFrom && mouseX < itemTo && mouseY > itemTop && mouseY < itemBottom;
    }

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
        return null;
    }

    drawItem(context: CanvasRenderingContext2D, item: TItem, options: ItemDrawOptions) {
        const { viewPort, onCustomDrawItem } = this.props;

        const width =
            Math.min(this.toAbsoluteX(viewPort.to) + 1, this.toAbsoluteX(item.to)) -
            Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from));

        context.clearRect(0, 0, width, lineHeight);
        const itemDrawContext = {
            width: width,
            lineHeight: lineHeight,
            options: options,
            itemPositionToAbsolute: value => this.toAbsoluteX(value) - this.toAbsoluteX(viewPort.from),
            adjustRect: rect => ({
                width:
                    Math.min(this.toAbsoluteX(viewPort.to) + 1, this.toAbsoluteX(rect.to)) -
                    Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(rect.from)),
                left: Math.max(
                    0,
                    this.toAbsoluteX(rect.from) -
                        Math.max(this.toAbsoluteX(viewPort.from) - 1, this.toAbsoluteX(item.from))
                ),
            }),
        };
        onCustomDrawItem(context, item, itemDrawContext);
    }

    handleMouseClick = (event: SyntheticMouseEvent<HTMLCanvasElement>) => {
        const canvas = this.canvas;
        const { onItemClick } = this.props;
        if (canvas == null || onItemClick == null) {
            return;
        }
        const itemAtCursor = this.getItemAtCursor(event);
        if (itemAtCursor != null) {
            onItemClick(itemAtCursor.item, itemAtCursor.lineIndex);
        }
    };

    handleChangeHoveredItem(
        prevHoveredItem: ?{ item: TItem, lineIndex: number },
        nextHoveredItem: ?{ item: TItem, lineIndex: number }
    ) {
        const canvas = this.canvas;
        if (canvas == null) {
            return;
        }
        const drawContext = canvas.getContext("2d");

        if (prevHoveredItem != null && (nextHoveredItem == null || nextHoveredItem.item !== prevHoveredItem.item)) {
            this.drawItemAtLine(drawContext, prevHoveredItem.item, prevHoveredItem.lineIndex, {
                hovered: false,
                selected: this.isItemSelected(prevHoveredItem.item, prevHoveredItem.lineIndex),
            });
        }
        if (nextHoveredItem != null && (prevHoveredItem == null || nextHoveredItem.item !== prevHoveredItem.item)) {
            this.drawItemAtLine(drawContext, nextHoveredItem.item, nextHoveredItem.lineIndex, {
                hovered: true,
                selected: this.isItemSelected(nextHoveredItem.item, nextHoveredItem.lineIndex),
            });
        }
        this.currentHoveredItem = nextHoveredItem;
    }

    handleMouseLeave = () => {
        this.handleChangeHoveredItem(this.currentHoveredItem, null);
    };

    handleMouseMove = (event: SyntheticMouseEvent<HTMLCanvasElement>) => {
        this.handleChangeHoveredItem(this.currentHoveredItem, this.getItemAtCursor(event));
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

    drawData = interruptible((interruptibleContext: IInterruptibleContext) => async (): Promise<void> => {
        const canvas = this.canvas;
        if (canvas == null) {
            return;
        }

        const { data, from, to } = this.props;
        const width = Math.round(this.toAbsoluteX(to) - this.toAbsoluteX(from));
        const drawContext = canvas.getContext("2d");

        drawContext.clearRect(0, 0, width, (lineHeight + lineGap) * data.lines.length);
        drawContext.save();
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
                    await interruptibleContext.check();
                }
            }
        } finally {
            drawContext.restore();
        }
    });

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
                {timeMarkers.map(timeMarker => (
                    <div
                        className={cn("time-marker")}
                        key={timeMarker.value}
                        style={{ left: this.toAbsoluteX(timeMarker.value) }}>
                        <div className={cn("time-marker-title")}>{timeMarker.title}</div>
                    </div>
                ))}
            </div>
        );
    }

    render(): React.Node {
        const { viewPort, data } = this.props;

        return (
            <div className={cn("root")}>
                <div className={cn("spacer-for-markers")} />
                <div className={cn("canvas-container")}>
                    <canvas
                        className={cn("primary-canvas")}
                        width={Math.round(this.toAbsoluteX(viewPort.to) - this.toAbsoluteX(viewPort.from))}
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
