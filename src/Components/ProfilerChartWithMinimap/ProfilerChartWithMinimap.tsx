import * as React from "react";

import { InvalidProgramStateError } from "../../Commons/Errors";
import { ProfilerChartContainer } from "../../Containers/ProfilerChartContainer";
import { ProfilerChartMinimapContainer } from "../../Containers/ProfilerChartMinimapContainer";
import { normalizeWheel } from "../../Domain/NormalizeWheel";
import { TimeRange } from "../../Domain/TimeRange";
import { ViewPortUtils } from "../../Domain/ViewPortUtils";
import { DocumentUtils, IListenerHandler } from "../DocumentUtils";
import { TimeMarkersBackground } from "../TimeMarkersBackground/TimeMarkersBackground";

import cn from "./ProfilerChartWithMinimap.less";

interface ProfilerChartWithMinimapProps<TItem extends TimeRange> {
    timeRange: TimeRange;
    viewPort: TimeRange;
    onChangeViewPort: (viewPort: TimeRange) => void;
}

interface ProfilerChartWithMinimapState {
    width?: number;
}

export class ProfilerChartWithMinimap<TItem extends TimeRange> extends React.Component<
    ProfilerChartWithMinimapProps<TItem>,
    ProfilerChartWithMinimapState
> {
    public state: ProfilerChartWithMinimapState = {};

    private readonly container = React.createRef<HTMLDivElement>();
    private readonly chartContainer = React.createRef<HTMLDivElement>();

    private initialScrollTop?: number;
    private initialViewPort?: TimeRange;
    private curXPos?: number;
    private curYPos?: number;
    private mouseMoveListener?: IListenerHandler;
    private mouseUpListener?: IListenerHandler;

    public componentDidMount(): void {
        this.updateWidth();
        window.addEventListener("resize", this.handleWindowResize);
    }

    public componentWillUnmount(): void {
        window.removeEventListener("resize", this.handleWindowResize);
    }

    public render(): JSX.Element {
        const { width } = this.state;
        return (
            <div className={cn("container")} ref={this.container}>
                {width != undefined && (
                    <>
                        <div className={cn("minimap-container")}>
                            <ProfilerChartMinimapContainer width={width} />
                        </div>
                        <div className={cn("chart-container")}>
                            <div
                                className={cn("chart-container-wrapper")}
                                onWheel={this.handleWheel}
                                onMouseDown={this.handleMouseDown}
                                ref={this.chartContainer}>
                                <div className={cn("spacer-for-markers")} />
                                <ProfilerChartContainer width={width} />
                            </div>
                            <TimeMarkersBackground
                                timeRange={this.props.timeRange}
                                viewPort={this.props.viewPort}
                                width={width}
                                fontSize={14}
                                titleHeight={20}
                            />
                        </div>
                    </>
                )}
            </div>
        );
    }

    private readonly handleWindowResize = () => {
        this.updateWidth();
    };

    private updateWidth(): void {
        const container = this.container.current;
        if (container == undefined) {
            return;
        }
        const newWidth = container.getBoundingClientRect().width;
        if (newWidth !== this.state.width) {
            this.setState({ width: newWidth });
        }
    }

    private processVerticalScroll(event: React.WheelEvent): void {
        const { pixelY } = normalizeWheel(event);
        const chartContainer = this.chartContainer.current;
        if (chartContainer == undefined) {
            return;
        }
        chartContainer.scrollTop += pixelY;
    }

    private processZooming(event: React.WheelEvent): void {
        const { spinY } = normalizeWheel(event);
        const container = this.container.current;
        if (container == undefined) {
            return;
        }
        const containerRect = container.getBoundingClientRect();
        const mouseX = event.clientX - containerRect.left;
        const xPosRelative = this.toRelative(mouseX);
        const timeRange = this.props.timeRange;
        const viewPort = this.props.viewPort;
        const newViewPort = ViewPortUtils.zoom(timeRange, viewPort, spinY, xPosRelative);
        this.props.onChangeViewPort(newViewPort);
    }

    private readonly handleWheel = (event: React.WheelEvent) => {
        if (event.shiftKey) {
            this.processVerticalScroll(event);
        } else {
            this.processZooming(event);
        }
        event.preventDefault();
    };

    private toRelative(value: number): number {
        const viewPort = this.props.viewPort;
        const width = this.state.width;
        if (width == undefined) {
            throw new InvalidProgramStateError();
        }
        return viewPort.from + (value * (this.props.viewPort.to - this.props.viewPort.from)) / width;
    }

    private readonly handleMouseMove = (e: MouseEvent) => {
        const chartContainer = this.chartContainer.current;
        if (
            chartContainer == undefined ||
            this.initialScrollTop == undefined ||
            this.curYPos == undefined ||
            this.initialViewPort == undefined ||
            this.curXPos == undefined
        ) {
            return;
        }

        chartContainer.scrollTop = this.initialScrollTop + (this.curYPos - e.pageY);

        const viewPortOffset = this.toRelative(this.curXPos) - this.toRelative(e.pageX);
        const nextViewPort = ViewPortUtils.offset(this.props.timeRange, this.initialViewPort, viewPortOffset);
        this.props.onChangeViewPort(nextViewPort);
    };

    private readonly handleMouseDown = (e: React.MouseEvent) => {
        const chartContainer = this.chartContainer.current;
        if (chartContainer == undefined) {
            return;
        }
        this.initialScrollTop = chartContainer.scrollTop;
        this.initialViewPort = this.props.viewPort;
        this.curXPos = e.pageX;
        this.curYPos = e.pageY;
        DocumentUtils.beginDragging();
        this.mouseMoveListener = DocumentUtils.addMouseMoveListener(this.handleMouseMove);
        this.mouseUpListener = DocumentUtils.addMouseUpListener(this.handleMouseUp);
    };

    private readonly handleMouseUp = () => {
        if (this.mouseMoveListener != undefined) {
            this.mouseMoveListener.remove();
            this.mouseMoveListener = undefined;
        }
        if (this.mouseUpListener != undefined) {
            this.mouseUpListener.remove();
            this.mouseUpListener = undefined;
        }
    };
}
