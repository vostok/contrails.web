import * as React from "react";
import ReactDom from "react-dom";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

import { InvalidProgramStateError } from "../../Commons/Errors";
import { TimeRange } from "../../Domain/TimeRange";
import { ViewPortUtils } from "../../Domain/ViewPortUtils";
import { TimeMarkersBackground } from "../TimeMarkersBackground/TimeMarkersBackground";

import cn from "./ProfilerChartMinimap.less";

export interface ChartMinimapItem {
    from: number;
    to: number;
    color?: string;
}

export interface MinimapChartData {
    lines: Array<{ items: ChartMinimapItem[] }>;
}

interface ProfilerChartMinimapProps {
    timeRange: TimeRange;
    viewPort: TimeRange;
    onChangeViewPort: (x: TimeRange) => void;
    data: MinimapChartData;
    width: number;
}

export class ProfilerChartMinimap extends React.Component<ProfilerChartMinimapProps> {
    private readonly canvas = React.createRef<HTMLCanvasElement>();
    private readonly container = React.createRef<HTMLDivElement>();

    public componentDidMount(): void {
        this.drawItems();
    }

    public render(): JSX.Element {
        const { timeRange, viewPort, width } = this.props;

        return (
            <div className={cn("container")} ref={this.container}>
                {this.renderCanvas(width)}
                <div
                    className={cn("left-shadow")}
                    style={{
                        width: this.toAbsoluteX(viewPort.from),
                    }}
                />
                <div
                    className={cn("right-shadow")}
                    style={{
                        width: this.toAbsoluteX(timeRange.from + timeRange.to - viewPort.to),
                    }}
                />
                <Draggable
                    axis="x"
                    onDrag={this.handleViewPortDrag}
                    bounds={{
                        top: 0,
                        bottom: 0,
                        left: this.toAbsoluteX(timeRange.from),
                        right: this.toAbsoluteX(timeRange.to - (viewPort.to - viewPort.from)),
                    }}
                    position={{ x: this.toAbsoluteX(viewPort.from), y: 0 }}>
                    <div
                        className={cn("scroller")}
                        style={{
                            width: this.toAbsoluteX(viewPort.to) - this.toAbsoluteX(viewPort.from),
                        }}
                    />
                </Draggable>
                <Draggable
                    axis="x"
                    onDrag={this.handleDragLeftHandle}
                    bounds={{
                        top: 0,
                        bottom: 0,
                        left: this.toAbsoluteX(timeRange.from),
                        right: this.toAbsoluteX(viewPort.to) - 10,
                    }}
                    position={{ x: this.toAbsoluteX(viewPort.from), y: 0 }}>
                    <div className={cn("left-handler-container")}>
                        <div className={cn("left-handler")} />
                    </div>
                </Draggable>
                <Draggable
                    axis="x"
                    onDrag={this.handleDragRightHandle}
                    bounds={{
                        top: 0,
                        bottom: 0,
                        left: this.toAbsoluteX(viewPort.from) + 10,
                        right: this.toAbsoluteX(timeRange.to),
                    }}
                    position={{ x: this.toAbsoluteX(viewPort.to), y: 0 }}>
                    <div className={cn("right-handler-container")}>
                        <div className={cn("right-handler")} />
                    </div>
                </Draggable>
            </div>
        );
    }

    private executeWithDrawContext(action: (context: CanvasRenderingContext2D, width: number) => void): void {
        const canvas = ReactDom.findDOMNode(this.canvas.current);
        const { width } = this.props;
        if (canvas instanceof HTMLCanvasElement && width != undefined) {
            const drawContext = canvas.getContext("2d");
            if (drawContext == undefined) {
                throw new InvalidProgramStateError();
            }
            action(drawContext, width);
        }
    }

    private drawItems(): void {
        this.executeWithDrawContext((context, width) => {
            context.save();
            try {
                const { data } = this.props;
                context.clearRect(0, 0, width, 100);
                const lineHeight = 5;

                let lineIndex = 0;
                for (const line of data.lines) {
                    for (const item of line.items) {
                        context.fillStyle = item.color || "rgba(30, 121, 190, 0.50)";
                        context.strokeStyle = "rgba(30, 121, 190, 1.0)";
                        context.lineWidth = 0.5;
                        context.fillRect(
                            this.toAbsoluteX(item.from),
                            lineIndex * lineHeight,
                            this.toAbsoluteX(item.to) - this.toAbsoluteX(item.from),
                            lineHeight
                        );
                        context.strokeRect(
                            this.toAbsoluteX(item.from),
                            lineIndex * lineHeight,
                            this.toAbsoluteX(item.to) - this.toAbsoluteX(item.from),
                            lineHeight
                        );
                    }
                    lineIndex++;
                }
            } finally {
                context.restore();
            }
        });
    }

    private readonly handleDragLeftHandle = (e: DraggableEvent, dragInfo: DraggableData) => {
        if (dragInfo.deltaX !== 0) {
            const {
                timeRange: { from },
                viewPort,
                onChangeViewPort,
            } = this.props;
            onChangeViewPort({
                from: Math.min(
                    Math.max(from, this.toRelativeX(dragInfo.x)),
                    this.toRelativeX(this.toAbsoluteX(viewPort.to) - 10)
                ),
                to: viewPort.to,
            });
        }
    };

    private readonly handleDragRightHandle = (e: DraggableEvent, dragInfo: DraggableData) => {
        if (dragInfo.deltaX !== 0) {
            const {
                timeRange: { to },
                viewPort,
                onChangeViewPort,
            } = this.props;
            onChangeViewPort({
                from: viewPort.from,
                to: Math.max(
                    Math.min(to, this.toRelativeX(dragInfo.x)),
                    this.toRelativeX(this.toAbsoluteX(viewPort.from) + 10)
                ),
            });
        }
    };

    private readonly handleViewPortDrag = (e: DraggableEvent, dragInfo: DraggableData) => {
        const { viewPort, onChangeViewPort } = this.props;
        const viewPortOffset = this.toRelativeX(dragInfo.x) - viewPort.from;
        const nextViewPort = ViewPortUtils.offset(this.props.timeRange, viewPort, viewPortOffset);
        onChangeViewPort(nextViewPort);
    };

    private toRelativeX(value: number): number {
        const { timeRange, width } = this.props;
        if (width == undefined) {
            throw new InvalidProgramStateError();
        }
        return (value * (timeRange.to - timeRange.from)) / width + timeRange.from;
    }

    private toAbsoluteX(value: number): number {
        const { timeRange, width } = this.props;
        if (width == undefined) {
            throw new InvalidProgramStateError();
        }
        return ((value - timeRange.from) * width) / (timeRange.to - timeRange.from);
    }

    private renderCanvas(width: number): JSX.Element {
        return (
            <div style={{ position: "relative", zIndex: 0 }}>
                <div style={{ position: "relative", height: 18 }} />
                <div style={{ position: "relative", zIndex: 2 }}>
                    <canvas ref={this.canvas} height={100} width={width} />
                </div>
                <TimeMarkersBackground
                    timeRange={this.props.timeRange}
                    width={width}
                    viewPort={this.props.timeRange}
                    fontSize={10}
                    titleHeight={14}
                />
            </div>
        );
    }
}
