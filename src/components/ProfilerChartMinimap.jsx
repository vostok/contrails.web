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
            context.fillStyle = "#efe";
            context.fillRect(0, 0, width, 100);
        });
    }

    handleDragLeftHandle = (e: SyntheticEvent, dragInfo: DraggableData) => {
        if (dragInfo.deltaX !== 0) {
            const { from, viewPort, onChangeViewPort } = this.props;
            onChangeViewPort({
                from: Math.min(
                    Math.max(from, this.toRelative(dragInfo.x)),
                    this.toRelative(this.toAbsolute(viewPort.to) - 10)
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
                    Math.min(to, this.toRelative(dragInfo.x)),
                    this.toRelative(this.toAbsolute(viewPort.from) + 10)
                ),
            });
        }
    };

    handleViewPortDrag = (e: SyntheticEvent, dragInfo: DraggableData) => {
        const { from, to, viewPort, onChangeViewPort } = this.props;
        if (dragInfo.deltaX < 0) {
            const newFrom = Math.max(from, this.toRelative(dragInfo.x));
            const newTo = newFrom + viewPort.to - viewPort.from;
            onChangeViewPort({
                from: newFrom,
                to: newTo,
            });
        } else if (dragInfo.deltaX > 0) {
            const newTo = Math.min(to, this.toRelative(dragInfo.x) + viewPort.to - viewPort.from);
            const newFrom = newTo - (viewPort.to - viewPort.from);
            onChangeViewPort({
                from: newFrom,
                to: newTo,
            });
        }
    };

    toRelative(value: number): number {
        const { width } = this.state;
        const { to, from } = this.props;
        if (width == null) {
            throw new Error("InvalidStateError");
        }
        return value * (to - from) / width;
    }

    toAbsolute(value: number): number {
        const { width } = this.state;
        const { to, from } = this.props;
        if (width == null) {
            throw new Error("InvalidStateError");
        }
        return width * value / (to - from);
    }

    renderCanvas(width: number): React.Element<*> {
        return <canvas ref={(e: HTMLCanvasElement) => (this.canvas = e)} height={100} width={width} />;
    }

    render(): React.Element<*> {
        const { width } = this.state;
        const { from, to, viewPort } = this.props;

        return (
            <Container ref={this.saveRef(x => (this.container = x))}>
                {width != null && this.renderCanvas(width)}
                {width != null &&
                    <Draggable
                        axis="x"
                        onDrag={this.handleViewPortDrag}
                        bounds={{
                            left: this.toAbsolute(from),
                            right: this.toAbsolute(to - (viewPort.to - viewPort.from)),
                        }}
                        position={{ x: this.toAbsolute(viewPort.from), y: 0 }}>
                        <Scroller
                            ref={(e: HTMLElement) => (this.scroller = e)}
                            style={{
                                width: this.toAbsolute(viewPort.to) - this.toAbsolute(viewPort.from),
                            }}
                        />
                    </Draggable>}
                {width != null &&
                    <Draggable
                        axis="x"
                        onDrag={this.handleDragLeftHandle}
                        bounds={{
                            left: this.toAbsolute(from),
                            right: this.toAbsolute(viewPort.to) - 10,
                        }}
                        position={{ x: this.toAbsolute(viewPort.from), y: 0 }}>
                        <LeftHandlerContainer>
                            <LeftHandler />
                        </LeftHandlerContainer>
                    </Draggable>}
                {width != null &&
                    <Draggable
                        axis="x"
                        onDrag={this.handleDragRightHandle}
                        bounds={{
                            left: this.toAbsolute(viewPort.from) + 10,
                            right: this.toAbsolute(to),
                        }}
                        position={{ x: this.toAbsolute(viewPort.to), y: 0 }}>
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

const RightHandlerContainer = glamorous.div({
    position: "absolute",
    top: 0,
    left: 0,
    width: 0,
});

const LeftHandler = glamorous.div({
    position: "absolute",
    top: 0,
    left: 0,
    width: 20,
    height: 50,
    backgroundColor: "rgba(0, 255, 0, 1)",
    cursor: "col-resize",
});

const RightHandler = glamorous.div({
    position: "absolute",
    top: 0,
    right: 0,
    width: 20,
    height: 50,
    backgroundColor: "rgba(0, 255, 0, 1)",
    cursor: "col-resize",
});

const Scroller = glamorous.div({
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    position: "absolute",
    top: 0,
    bottom: 0,
});

const Container = glamorous.div({
    height: 100,
    position: "relative",
});
