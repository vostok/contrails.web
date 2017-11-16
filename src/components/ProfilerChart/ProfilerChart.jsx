// @flow
import * as React from "react";
import rbush from "rbush";

import generateTimeMarkers from "../../Domain/TimeMarkers";
import type { TimeMarker } from "../../Domain/TimeMarkers";

import DefaultCustomItemDrawer from "./DefaultCustomDrawHandler";
import ProfilerChartDrawer from "./ProfilerChartDrawer";
import cn from "./ProfilerChart.less";
import type { ICustomItemDrawer } from "./ICustomItemDrawer";

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
    viewPort: {
        from: number,
        to: number,
    },
    onItemClick?: (item: TItem, lineIndex: number) => void,
    selectedItems?: TItem[],
    itemDrawer?: ICustomItemDrawer<TItem>,
|};

const lineHeight = 35;
const lineGap = 1;

export default class ProfilerChart<TItem: ProfilerItem> extends React.Component<ProfilerChartProps<TItem>, void> {
    props: ProfilerChartProps<TItem>;
    canvas: ?HTMLCanvasElement = null;
    currentHoveredItem: ?{
        item: TItem,
        lineIndex: number,
    };
    itemsRTree = rbush();
    container: ?HTMLDivElement;
    textContainer: ?HTMLDivElement;
    hoveredContainer: ?HTMLDivElement;
    selectedContainer: ?HTMLDivElement;
    profilerChartDrawer: ProfilerChartDrawer<TItem>;

    componentDidMount() {
        const { itemDrawer, data, viewPort, xScale } = this.props;
        const height = (lineHeight + lineGap) * data.lines.length;
        const width = Math.round(this.toAbsoluteX(viewPort.to) - this.toAbsoluteX(viewPort.from));
        if (
            this.container == null ||
            this.textContainer == null ||
            this.selectedContainer == null ||
            this.hoveredContainer == null
        ) {
            return;
        }
        this.profilerChartDrawer = new ProfilerChartDrawer(
            {
                backgroundsLayer: this.container,
                textLayer: this.textContainer,
                selectedLayer: this.selectedContainer,
                hoveredLayer: this.hoveredContainer,
                width: width,
                height: height,
                viewPort: viewPort,
                xScale: xScale,
                range: { from: this.props.from, to: this.props.to },
            },
            data,
            itemDrawer || new DefaultCustomItemDrawer()
        );
        this.profilerChartDrawer.drawBackground();
        this.profilerChartDrawer.drawTextElements();
        this.buildIndex();
    }

    buildIndex() {
        const { data } = this.props;

        for (let lineIndex = 0; lineIndex < data.lines.length; lineIndex++) {
            const line = data.lines[lineIndex];
            for (const item of line.items) {
                if (!this.rects) {
                    this.itemsRTree.insert({
                        minX: item.from,
                        minY: lineIndex * (lineGap + lineHeight),
                        maxX: item.to,
                        maxY: lineIndex * (lineGap + lineHeight) + lineHeight,
                        source: item,
                        lineIndex: lineIndex,
                    });
                }
            }
        }
    }

    componentDidUpdate() {
        this.profilerChartDrawer.updateViewPort(this.props.viewPort, this.props.xScale);
        if (this.props.selectedItems != null && this.props.selectedItems.length > 0) {
            this.profilerChartDrawer.setSelectedItem(this.findItem(this.props.selectedItems[0]));
        } else {
            this.profilerChartDrawer.setSelectedItem(null);
        }
    }

    findItem(targetItem: TItem): ?{ item: TItem, lineIndex: number } {
        // TODO O(n)
        const { data } = this.props;
        for (let lineIndex = 0; lineIndex < data.lines.length; lineIndex++) {
            const line = data.lines[lineIndex];
            for (const item of line.items) {
                if (item === targetItem) {
                    return { item: item, lineIndex: lineIndex };
                }
            }
        }
        return null;
    }

    toAbsoluteX(itemX: number): number {
        const { xScale, viewPort } = this.props;
        return (itemX - viewPort.from) * xScale;
    }

    toInternalX(absoluteX: number): number {
        const { xScale, viewPort } = this.props;
        return absoluteX / xScale + viewPort.from;
    }

    getItemAtCursor(event: SyntheticMouseEvent<HTMLCanvasElement>): ?{ item: TItem, lineIndex: number } {
        const canvas = this.canvas;
        if (canvas == null) {
            return null;
        }

        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;

        const result = this.itemsRTree.search({
            minX: this.toInternalX(mouseX),
            minY: mouseY,
            maxX: this.toInternalX(mouseX + 1),
            maxY: mouseY + 1,
        });
        if (result.length > 0) {
            return { item: result[0].source, lineIndex: result[0].lineIndex };
        }
        return null;
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

    handleMouseLeave = () => {
        this.profilerChartDrawer.setHoveredItem(null);
    };

    handleMouseMove = (event: SyntheticMouseEvent<HTMLCanvasElement>) => {
        this.profilerChartDrawer.setHoveredItem(this.getItemAtCursor(event));
    };

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
            <div
                onClick={this.handleMouseClick}
                className={cn("root")}
                onMouseMove={this.handleMouseMove}
                onMouseLeave={this.handleMouseLeave}>
                <div className={cn("spacer-for-markers")} />
                <div className={cn("canvas-container")} ref={x => (this.container = x)} />
                <div className={cn("canvas-container-2")} ref={x => (this.textContainer = x)}>
                    <canvas
                        className={cn("primary-canvas")}
                        width={Math.round(this.toAbsoluteX(viewPort.to) - this.toAbsoluteX(viewPort.from))}
                        ref={e => (this.canvas = e)}
                        height={(lineHeight + lineGap) * data.lines.length}
                    />
                </div>
                <div className={cn("canvas-container-2")} ref={x => (this.selectedContainer = x)} />
                <div className={cn("canvas-container-2")} ref={x => (this.hoveredContainer = x)} />
                {this.renderTimeMarkers()}
            </div>
        );
    }
}
