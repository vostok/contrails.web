// @flow
import * as React from "react";
import ReactDom from "react-dom";
import Draggable from "react-draggable";
import type { DraggableData } from "react-draggable";

import generateTimeMarkers from "../../Domain/TimeMarkers";
import type { TimeMarker } from "../../Domain/TimeMarkers";

import cn from "./ProfilerChartMinimap.less";

export type ChartMinimapItem = {
    from: number,
    to: number,
    color: ?string,
};

type ProfilerChartMinimapProps = {
    from: number,
    to: number,
    viewPort: {
        from: number,
        to: number,
    },
    onChangeViewPort: ({
        from: number,
        to: number,
    }) => void,
    data: { lines: Array<{ items: Array<ChartMinimapItem> }> },
};

type ProfilerChartMinimapState = {
    width: ?number,
};

export default class ProfilerChartMinimap extends React.Component<
    ProfilerChartMinimapProps,
    ProfilerChartMinimapState
> {
    props: ProfilerChartMinimapProps;
    state: ProfilerChartMinimapState = { width: null };
    canvas: ?HTMLCanvasElement;
    container: ?HTMLDivElement;
    scroller: ?HTMLDivElement;

    saveRef(to: HTMLElement => ?HTMLElement): HTMLElement => void {
        return (e: HTMLElement) => {
            to(e);
        };
    }

    componentDidMount() {
        this.updateWidth();
    }

    componentDidUpdate() {
        this.updateWidth();
    }

    updateWidth() {
        const container = ReactDom.findDOMNode(this.container);
        if (!(container instanceof HTMLElement)) {
            return;
        }
        const { width } = this.state;
        const newWidth = container.getBoundingClientRect().width;
        if (newWidth !== width) {
            this.setState(
                {
                    width: newWidth,
                },
                () => this.reflow()
            );
        }
    }

    reflow() {
        this.drawItems();
    }

    executeWithDrawContext(action: (context: CanvasRenderingContext2D, width: number) => void) {
        const canvas = ReactDom.findDOMNode(this.canvas);
        const { width } = this.state;
        if (canvas instanceof HTMLCanvasElement && width != null) {
            const drawContext = canvas.getContext("2d");
            action(drawContext, width);
        }
    }

    drawItems() {
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

    handleDragLeftHandle = (e: SyntheticMouseEvent<>, dragInfo: DraggableData) => {
        if (dragInfo.deltaX !== 0) {
            const { from, viewPort, onChangeViewPort } = this.props;
            onChangeViewPort({
                from: Math.min(
                    Math.max(from, this.toRelativeX(dragInfo.x)),
                    this.toRelativeX(this.toAbsoluteX(viewPort.to) - 10)
                ),
                to: viewPort.to,
            });
        }
    };

    handleDragRightHandle = (e: SyntheticMouseEvent<>, dragInfo: DraggableData) => {
        if (dragInfo.deltaX !== 0) {
            const { to, viewPort, onChangeViewPort } = this.props;
            onChangeViewPort({
                from: viewPort.from,
                to: Math.max(
                    Math.min(to, this.toRelativeX(dragInfo.x)),
                    this.toRelativeX(this.toAbsoluteX(viewPort.from) + 10)
                ),
            });
        }
    };

    handleViewPortDrag = (e: SyntheticMouseEvent<>, dragInfo: DraggableData) => {
        const { from, to, viewPort, onChangeViewPort } = this.props;
        if (dragInfo.deltaX < 0) {
            const newFrom = Math.max(from, this.toRelativeX(dragInfo.x));
            const newTo = newFrom + viewPort.to - viewPort.from;
            onChangeViewPort({
                from: newFrom,
                to: newTo,
            });
        } else if (dragInfo.deltaX > 0) {
            const newTo = Math.min(to, this.toRelativeX(dragInfo.x) + viewPort.to - viewPort.from);
            const newFrom = newTo - (viewPort.to - viewPort.from);
            onChangeViewPort({
                from: newFrom,
                to: newTo,
            });
        }
    };

    toRelativeX(value: number): number {
        const { width } = this.state;
        const { to, from } = this.props;
        if (width == null) {
            throw new Error("InvalidStateError");
        }
        return value * (to - from) / width + from;
    }

    toAbsoluteX(value: number): number {
        const { width } = this.state;
        const { to, from } = this.props;
        if (width == null) {
            throw new Error("InvalidStateError");
        }
        return (value - from) * width / (to - from);
    }

    generateTimeMarkers(): TimeMarker[] {
        const { width } = this.state;
        const { to, from } = this.props;
        if (width == null) {
            return [];
        }
        const scale = width / (to - from);
        return generateTimeMarkers(0, to - from, 100 / scale).map(x => ({ ...x, value: x.value + from }));
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

    renderCanvas(width: number): React.Element<*> {
        return (
            <div style={{ position: "relative", zIndex: 0 }}>
                <div style={{ position: "relative", height: 18 }} />
                <div style={{ position: "relative", zIndex: 2 }}>
                    <canvas ref={e => (this.canvas = e)} height={100} width={width} />
                </div>
                {this.renderTimeMarkers()}
            </div>
        );
    }

    render(): React.Element<*> {
        const { width } = this.state;
        const { from, to, viewPort } = this.props;
        return (
            <div className={cn("container")} ref={x => (this.container = x)}>
                {width != null && this.renderCanvas(width)}
                {width != null && (
                    <div
                        className={cn("left-shadow")}
                        style={{
                            width: this.toAbsoluteX(viewPort.from),
                        }}
                    />
                )}
                {width != null && (
                    <div
                        className={cn("right-shadow")}
                        style={{
                            width: this.toAbsoluteX(from + to - viewPort.to),
                        }}
                    />
                )}
                {width != null && (
                    <Draggable
                        axis="x"
                        onDrag={this.handleViewPortDrag}
                        bounds={{
                            left: this.toAbsoluteX(from),
                            right: this.toAbsoluteX(to - (viewPort.to - viewPort.from)),
                        }}
                        position={{ x: this.toAbsoluteX(viewPort.from), y: 0 }}>
                        <div
                            className={cn("scroller")}
                            ref={e => (this.scroller = e)}
                            style={{
                                width: this.toAbsoluteX(viewPort.to) - this.toAbsoluteX(viewPort.from),
                            }}
                        />
                    </Draggable>
                )}
                {width != null && (
                    <Draggable
                        axis="x"
                        onDrag={this.handleDragLeftHandle}
                        bounds={{
                            left: this.toAbsoluteX(from),
                            right: this.toAbsoluteX(viewPort.to) - 10,
                        }}
                        position={{ x: this.toAbsoluteX(viewPort.from), y: 0 }}>
                        <div className={cn("left-handler-container")}>
                            <div className={cn("left-handler")} />
                        </div>
                    </Draggable>
                )}
                {width != null && (
                    <Draggable
                        axis="x"
                        onDrag={this.handleDragRightHandle}
                        bounds={{
                            left: this.toAbsoluteX(viewPort.from) + 10,
                            right: this.toAbsoluteX(to),
                        }}
                        position={{ x: this.toAbsoluteX(viewPort.to), y: 0 }}>
                        <div className={cn("right-handler-container")}>
                            <div className={cn("right-handler")} />
                        </div>
                    </Draggable>
                )}
            </div>
        );
    }
}
