// @flow
import * as React from "react";
import ReactDom from "react-dom";
import glamorous from "glamorous";

type ProfilerChartProps = {|
    from: number,
    to: number,
    viewPort: {
        from: number,
        scale: number,
    },
    onChangeViewPort?: ({
        from: number,
        scale: number,
    }) => void,
    children: React.Node,
|};

const Wrapper = glamorous.div({
    overflowX: "hidden",
    overflowY: "auto",
    position: "relative",
});

export default class ProfilerChartContainer extends React.Component<ProfilerChartProps> {
    props: ProfilerChartProps;
    container: ?React.Component<{}>;

    toAbsolute(itemX: number): number {
        const { viewPort, from } = this.props;
        return (itemX - from) * viewPort.scale;
    }

    toRelative(itemX: number): number {
        const { viewPort, from } = this.props;
        return (itemX - from) * viewPort.scale;
    }

    adjustScrollPosition() {
        const container = ReactDom.findDOMNode(this.container);
        if (!(container instanceof HTMLElement)) {
            return;
        }
        const { viewPort } = this.props;
        container.scrollLeft = this.toAbsolute(viewPort.from);
    }

    componentDidUpdate() {
        this.adjustScrollPosition();
    }

    initialFrom: number;
    curXPos: number;
    curDown: boolean;

    handleMouseMove = (e: SyntheticMouseEvent<>) => {
        if (this.curDown) {
            const container = ReactDom.findDOMNode(this.container);
            if (!(container instanceof HTMLElement)) {
                return;
            }
            const { onChangeViewPort, viewPort } = this.props;
            if (onChangeViewPort != null) {
                onChangeViewPort({ ...viewPort, from: this.initialFrom + (this.curXPos - e.pageX) / viewPort.scale });
            }
        }
    };

    handleMouseDown = (e: SyntheticMouseEvent<>) => {
        const container = ReactDom.findDOMNode(this.container);
        if (!(container instanceof HTMLElement)) {
            return;
        }

        const { viewPort } = this.props;
        this.initialFrom = viewPort.from;
        this.curXPos = e.pageX;
        this.curDown = true;
    };

    handleMouseUp = () => {
        this.curDown = false;
    };

    render(): React.Node {
        const { children } = this.props;
        return (
            <Wrapper
                ref={e => (this.container = e)}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseMove={this.handleMouseMove}
                onMouseLeave={() => {
                    this.curDown = false;
                }}>
                {children}
            </Wrapper>
        );
    }
}
