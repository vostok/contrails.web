// @flow
import * as React from "react";
import _ from "lodash";
import ReactDom from "react-dom";

import DocumentUtils from "../DocumentUtils";
import type { IListenerHandler } from "../DocumentUtils";
import ProfilerChart from "../ProfilerChart/ProfilerChart";
import type { ProfilerData, ProfilerItem, ItemDrawContext } from "../ProfilerChart/ProfilerChart";
import ProfilerChartContainer from "../ProfilerChartContainer/ProfilerChartContainer";
import ProfilerChartMinimap from "../ProfilerChartMinimap/ProfilerChartMinimap";
import normalizeWheel from "../../Domain/NormalizeWheel";

import cn from "./ProfilerChartWithMinimap.less";

type ProfilerChartWithMinimapProps<TItem> = {
    data: ProfilerData<TItem>,
    from: number,
    to: number,
    selectedItems?: TItem[],
    onItemClick?: TItem => void,
    onGetMinimapColor?: TItem => ?string,
    onCustomDrawItem?: (context: CanvasRenderingContext2D, item: TItem, options: ItemDrawContext) => void,
    onChangeViewPort: (viewPort: { from: number, to: number }) => void,
};

type ProfilerChartWithMinimapState = {
    width: ?number,
    viewPortFrom: ?number,
    xScale: ?number,
};

export default class ProfilerChartWithMinimap<TItem: ProfilerItem> extends React.Component<
    ProfilerChartWithMinimapProps<TItem>,
    ProfilerChartWithMinimapState
> {
    props: ProfilerChartWithMinimapProps<TItem>;
    state: ProfilerChartWithMinimapState = {
        width: null,
        viewPortFrom: null,
        xScale: null,
    };
    container: ?React.ElementRef<*>;
    chartContainer: ?React.ElementRef<*>;
    initialScrollTop: number;
    curYPos: number;
    mouseMoveListener: ?IListenerHandler = null;
    mouseUpListener: ?IListenerHandler = null;

    getViewPortRange(): { from: number, to: number } {
        const { viewPortFrom, width, xScale } = this.state;
        if (viewPortFrom != null && xScale != null && width != null) {
            return {
                from: viewPortFrom,
                to: viewPortFrom + width / xScale,
            };
        }
        return {
            from: this.props.from,
            to: this.props.to,
        };
    }

    componentDidUpdate() {
        this.updateWidth();
    }

    componentDidMount() {
        this.updateWidth();
    }

    isItemInViewPort(item: TItem): boolean {
        const viewPortRange = this.getViewPortRange();
        return item.to > viewPortRange.from && item.from < viewPortRange.to;
    }

    setViewPortFrom(value: number) {
        this.setState(
            {
                viewPortFrom: value,
            },
            () => {
                const { onChangeViewPort } = this.props;
                onChangeViewPort(this.getViewPortRange());
            }
        );
    }

    setViewPortTo(value: number) {
        const { width, xScale } = this.state;
        if (width != null && xScale != null) {
            this.setState(
                {
                    viewPortFrom: value - width / xScale,
                },
                () => {
                    const { onChangeViewPort } = this.props;
                    onChangeViewPort(this.getViewPortRange());
                }
            );
        }
    }

    componentWillReceiveProps(nextProps: ProfilerChartWithMinimapProps<TItem>) {
        if (!_.isEqual(nextProps.selectedItems, this.props.selectedItems)) {
            if (nextProps.selectedItems != null && nextProps.selectedItems.length > 0) {
                const firstSelectedItem = nextProps.selectedItems[0];
                const viewPortRange = this.getViewPortRange();

                if (!this.isItemInViewPort(firstSelectedItem)) {
                    if (firstSelectedItem.to < viewPortRange.from) {
                        this.setViewPortFrom(firstSelectedItem.from);
                    } else {
                        this.setViewPortTo(firstSelectedItem.to);
                    }
                }
            }
        }
    }

    updateWidth() {
        const container = ReactDom.findDOMNode(this.container);
        if (!(container instanceof HTMLElement)) {
            return;
        }
        const { width } = this.state;
        const newWidth = container.getBoundingClientRect().width;
        if (newWidth !== width) {
            const { viewPortFrom, xScale } = this.state;
            if (viewPortFrom == null && xScale == null) {
                const { from, to } = this.props;
                this.setState({
                    width: newWidth,
                    viewPortFrom: from,
                    xScale: newWidth / (to - from),
                });
            } else {
                this.setState({
                    width: newWidth,
                });
            }
        }
    }

    handleWheel = (event: SyntheticWheelEvent<>) => {
        const { spinY, pixelY } = normalizeWheel(event);
        if (event.shiftKey) {
            const chartContainer = ReactDom.findDOMNode(this.chartContainer);
            if (!(chartContainer instanceof HTMLElement)) {
                return;
            }
            chartContainer.scrollTop += pixelY;
            event.preventDefault();
            return;
        }
        const { width, xScale, viewPortFrom } = this.state;
        const { from: maxFrom, to: maxTo } = this.props;
        const container = ReactDom.findDOMNode(this.container);
        if (!(container instanceof HTMLElement)) {
            return;
        }

        if (width == null || xScale == null || viewPortFrom == null) {
            return;
        }
        const containerRect = container.getBoundingClientRect();
        const mouseX = event.clientX - containerRect.left;
        const percentage = 0.2;

        const from = viewPortFrom;
        const to = viewPortFrom + width / xScale;
        const xPosRelative = this.toRelative(mouseX);
        const newViewPortWidth = Math.max(
            (to - from) * Math.pow(1 + percentage * Math.sign(spinY), Math.abs(spinY)),
            1
        );

        let newFrom = xPosRelative - newViewPortWidth * (from - xPosRelative) / (from - to);
        let newTo = xPosRelative + newViewPortWidth * (xPosRelative - to) / (from - to);
        if (newFrom < maxFrom && newTo > maxTo) {
            newFrom = maxFrom;
            newTo = maxTo;
        } else if (newFrom < maxFrom) {
            newFrom = maxFrom;
            newTo = maxFrom + newViewPortWidth;
        } else if (newTo > maxTo) {
            newFrom = maxTo - newViewPortWidth;
            newTo = maxTo;
        }
        const newXScale = width / (newTo - newFrom);
        const maxScale = width / (maxTo - maxFrom);
        this.setState(
            {
                viewPortFrom: Math.max(maxFrom, newFrom),
                xScale: Math.max(newXScale, maxScale),
            },
            () => {
                const { onChangeViewPort } = this.props;
                onChangeViewPort(this.getViewPortRange());
            }
        );

        event.preventDefault();
    };

    toRelative(value: number): number {
        const { viewPortFrom, xScale } = this.state;
        if (xScale == null) {
            throw new Error("InvalidStateError");
        }
        return viewPortFrom + value / xScale;
    }

    handleMouseMove = (e: MouseEvent) => {
        const chartContainer = ReactDom.findDOMNode(this.chartContainer);
        if (!(chartContainer instanceof HTMLElement)) {
            return;
        }
        chartContainer.scrollTop = this.initialScrollTop + (this.curYPos - e.pageY);
    };

    handleMouseDown = (e: MouseEvent) => {
        const chartContainer = ReactDom.findDOMNode(this.chartContainer);
        if (!(chartContainer instanceof HTMLElement)) {
            return;
        }
        this.initialScrollTop = chartContainer.scrollTop;
        this.curYPos = e.pageY;
        this.mouseMoveListener = DocumentUtils.addMouseMoveListener(this.handleMouseMove);
        this.mouseUpListener = DocumentUtils.addMouseUpListener(this.handleMouseUp);
    };

    handleMouseUp = () => {
        if (this.mouseMoveListener != null) {
            this.mouseMoveListener.remove();
            this.mouseMoveListener = null;
        }
        if (this.mouseUpListener != null) {
            this.mouseUpListener.remove();
            this.mouseUpListener = null;
        }
    };

    handleChangeViewPort = (viewPort: { from: number, to: number }) => {
        const { width } = this.state;
        if (width == null) {
            return;
        }
        this.setState(
            {
                viewPortFrom: viewPort.from,
                xScale: width / (viewPort.to - viewPort.from),
            },
            () => {
                const { onChangeViewPort } = this.props;
                onChangeViewPort(this.getViewPortRange());
            }
        );
    };

    render(): React.Element<*> {
        const { data, from, to, onItemClick, selectedItems, onGetMinimapColor } = this.props;
        const { width, xScale, viewPortFrom } = this.state;
        return (
            <div className={cn("container")} ref={x => (this.container = x)}>
                {width != null &&
                    viewPortFrom != null &&
                    xScale != null && (
                        <div className={cn("minimap-container")}>
                            <ProfilerChartMinimap
                                data={{
                                    lines: data.lines.map(line => ({
                                        items: line.items.map(item => ({
                                            from: item.from,
                                            to: item.to,
                                            color: onGetMinimapColor != null ? onGetMinimapColor(item) : null,
                                        })),
                                    })),
                                }}
                                from={from}
                                to={to}
                                viewPort={{
                                    from: viewPortFrom,
                                    to: viewPortFrom + width / xScale,
                                }}
                                onChangeViewPort={this.handleChangeViewPort}
                            />
                        </div>
                    )}
                {width != null &&
                    viewPortFrom != null &&
                    xScale != null && (
                        <div
                            className={cn("chart-container")}
                            onWheel={this.handleWheel}
                            ref={x => (this.chartContainer = x)}>
                            <div />
                            <div onMouseDown={this.handleMouseDown}>
                                <ProfilerChartContainer
                                    from={from}
                                    to={to}
                                    onChangeViewPort={x =>
                                        this.setState(
                                            {
                                                viewPortFrom: Math.min(Math.max(from, x.from), to - width / xScale),
                                                xScale: x.scale,
                                            },
                                            () => {
                                                const { onChangeViewPort } = this.props;
                                                onChangeViewPort(this.getViewPortRange());
                                            }
                                        )}
                                    viewPort={{
                                        from: viewPortFrom,
                                        scale: xScale,
                                    }}>
                                    <ProfilerChart
                                        from={from}
                                        to={to}
                                        viewPort={{
                                            from: viewPortFrom,
                                            to: viewPortFrom + width / xScale,
                                        }}
                                        xScale={xScale}
                                        data={data}
                                        onItemClick={onItemClick}
                                        selectedItems={selectedItems}
                                        onCustomDrawItem={this.props.onCustomDrawItem}
                                    />
                                </ProfilerChartContainer>
                            </div>
                        </div>
                    )}
            </div>
        );
    }
}
