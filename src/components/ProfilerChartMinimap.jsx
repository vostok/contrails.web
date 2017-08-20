// @flow
import React from "react";
import ReactDom from "react-dom";
import glamorous from "glamorous";
import Draggable from "react-draggable";
import type { DraggableData } from "react-draggable";

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
};

type ProfilerChartMinimapState = {
    width: ?number,
};

export default class ProfilerChartMinimap extends React.Component {
    props: ProfilerChartMinimapProps;
    state: ProfilerChartMinimapState = { width: null };
    canvas: ?HTMLCanvasElement;
    container: ?HTMLElement;
    scroller: ?HTMLElement;

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
            const { data } = this.props;
            context.fillStyle = "rgba(255, 255, 255, 0.0)";
            context.fillRect(0, 0, width, 100);
            const lineHeight = 10;

            let lineIndex = 0;
            for (const line of data.lines) {
                context.fillStyle = "rgba(255, 180, 180, 0.5)";
                context.strokeStyle = "rgba(0, 0, 0, 0.5)";
                context.lineWidth = 0.5;
                for (const item of line.items) {
                    context.rect(
                        this.toAbsoluteX(item.from),
                        lineIndex * lineHeight,
                        this.toAbsoluteX(item.to) - this.toAbsoluteX(item.from),
                        lineHeight
                    );
                }
                lineIndex++;
            }
            context.stroke();
            context.fill();
        });
    }

    handleDragLeftHandle = (e: SyntheticEvent, dragInfo: DraggableData) => {
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

    handleDragRightHandle = (e: SyntheticEvent, dragInfo: DraggableData) => {
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

    handleViewPortDrag = (e: SyntheticEvent, dragInfo: DraggableData) => {
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

    generateTimeMarkers() {
        return [
            { title: "1s", value: 1 },
            { title: "3s", value: 3 },
            { title: "5s", value: 5 },
            { title: "7s", value: 7 },
            { title: "9s", value: 9 },
        ];
    }

    renderTimeMarkers(): React.Element<*> {
        const timeMarkers = this.generateTimeMarkers();
        return (
            <TimeMarkersContainer>
                {timeMarkers.map(timeMarker =>
                    <TimeMarker key={timeMarker.value} style={{ left: this.toAbsoluteX(timeMarker.value) }}>
                        <TimeMarkerTitle>
                            {timeMarker.title}
                        </TimeMarkerTitle>
                    </TimeMarker>
                )}
            </TimeMarkersContainer>
        );
    }

    renderCanvas(width: number): React.Element<*> {
        return (
            <div style={{ position: "relative", zIndex: 0 }}>
                <div style={{ position: "relative", height: 15 }} />
                <div style={{ position: "relative", zIndex: 2 }}>
                    <canvas ref={(e: HTMLCanvasElement) => (this.canvas = e)} height={100} width={width} />
                </div>
                {this.renderTimeMarkers()}
            </div>
        );
    }

    render(): React.Element<*> {
        const { width } = this.state;
        const { from, to, viewPort } = this.props;
        return (
            <Container ref={this.saveRef(x => (this.container = x))}>
                {width != null && this.renderCanvas(width)}
                {width != null &&
                    <LeftShadow
                        style={{
                            width: this.toAbsoluteX(viewPort.from),
                        }}
                    />}
                {width != null &&
                    <RightShadow
                        style={{
                            width: this.toAbsoluteX(from + to - viewPort.to),
                        }}
                    />}
                {width != null &&
                    <Draggable
                        axis="x"
                        onDrag={this.handleViewPortDrag}
                        bounds={{
                            left: this.toAbsoluteX(from),
                            right: this.toAbsoluteX(to - (viewPort.to - viewPort.from)),
                        }}
                        position={{ x: this.toAbsoluteX(viewPort.from), y: 0 }}>
                        <Scroller
                            ref={(e: HTMLElement) => (this.scroller = e)}
                            style={{
                                width: this.toAbsoluteX(viewPort.to) - this.toAbsoluteX(viewPort.from),
                            }}
                        />
                    </Draggable>}
                {width != null &&
                    <Draggable
                        axis="x"
                        onDrag={this.handleDragLeftHandle}
                        bounds={{
                            left: this.toAbsoluteX(from),
                            right: this.toAbsoluteX(viewPort.to) - 10,
                        }}
                        position={{ x: this.toAbsoluteX(viewPort.from), y: 0 }}>
                        <LeftHandlerContainer>
                            <LeftHandler />
                        </LeftHandlerContainer>
                    </Draggable>}
                {width != null &&
                    <Draggable
                        axis="x"
                        onDrag={this.handleDragRightHandle}
                        bounds={{
                            left: this.toAbsoluteX(viewPort.from) + 10,
                            right: this.toAbsoluteX(to),
                        }}
                        position={{ x: this.toAbsoluteX(viewPort.to), y: 0 }}>
                        <RightHandlerContainer>
                            <RightHandler />
                        </RightHandlerContainer>
                    </Draggable>}
            </Container>
        );
    }
}

const LeftHandlerContainer = glamorous.div({
    position: "absolute",
    top: 0,
    left: 0,
    width: 0,
});

const LeftShadow = glamorous.div({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
});

const RightShadow = glamorous.div({
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
});

const RightHandlerContainer = glamorous.div({
    position: "absolute",
    top: 0,
    left: 0,
    width: 0,
});

const LeftHandler = glamorous.div({
    position: "absolute",
    top: 0,
    left: -2,
    width: 5,
    height: 20,
    backgroundColor: "#3072C4",
    cursor: "e-resize",
});

const RightHandler = glamorous.div({
    position: "absolute",
    top: 0,
    right: -2,
    width: 5,
    height: 20,
    backgroundColor: "#3072C4",
    cursor: "e-resize",
});

const Scroller = glamorous.div({
    backgroundColor: "transparent",
    borderLeft: "1px solid #3072C4",
    borderRight: "1px solid #3072C4",
    position: "absolute",
    boxSizing: "border-box",
    top: 0,
    bottom: 0,
    cursor: "grab",
});

const Container = glamorous.div({
    height: 100,
    position: "relative",
    overflow: "hidden",
    borderBottom: "#eee",
});

const TimeMarkersContainer = glamorous.div({
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
});

const TimeMarkerTitle = glamorous.div({
    zIndex: 1,
    position: "absolute",
    top: 0,
    right: 3,
    color: "#A0A0A0",
    fontSize: "10px",
    lineHeight: "10px",
});

const TimeMarker = glamorous.div({
    zIndex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
});
