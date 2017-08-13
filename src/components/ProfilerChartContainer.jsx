// @flow
import React from "react";
import ReactDom from "react-dom";
import glamorous from "glamorous";

type ProfilerChartProps = {|
    from: number,
    to: number,
    viewPort: {
        from: number,
        scale: number,
    },
    children?: React.Element<*>[],
|};

const Wrapper = glamorous.div({
    overflowX: "hidden",
    overflowY: "auto",
    position: "relative",
});

export default class ProfilerChartContainer extends React.Component {
    props: ProfilerChartProps;
    container: Wrapper;

    toAbsolute(itemX: number): number {
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

    render(): React.Element<*> {
        const { children } = this.props;

        return (
            <Wrapper ref={(e: Wrapper) => (this.container = e)}>
                {children}
            </Wrapper>
        );
    }
}
