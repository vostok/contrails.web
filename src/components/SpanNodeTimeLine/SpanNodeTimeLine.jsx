// @flow
import * as React from "react";

import type { SpanNode } from "../../Domain/TraceTree/SpanNode";
import type { TimeRange } from "../../Domain/TimeRange";
import Colors from "../../Domain/Colors";

import cn from "./SpanNodeTimeLine.less";

type SpanNodeTimeLineProps = {
    node: SpanNode,
    totalTimeRange: TimeRange,
};

export default class SpanNodeTimeLine extends React.Component<SpanNodeTimeLineProps, void> {
    props: SpanNodeTimeLineProps;
    lastWidth: ?number = null;
    container: ?HTMLElement;
    span: ?HTMLElement;

    componentDidUpdate() {
        this.updateSpanPosition();
    }

    componentDidMount() {
        this.updateSpanPosition();
    }

    componentWillReceiveProps() {
        this.updateSpanPosition();
    }

    getSpanPosition(containerWidth: number): { width: number, left: number } {
        const { node, totalTimeRange } = this.props;
        const timeRangeDuration = totalTimeRange.to - totalTimeRange.from;
        const nodeDuration = node.to - node.from;

        const left = Math.round(
            (node.from / timeRangeDuration - totalTimeRange.from / timeRangeDuration) * containerWidth
        );
        const width = Math.max(4, Math.round(nodeDuration / timeRangeDuration) * containerWidth);
        return {
            width: Math.min(containerWidth - left, width),
            left: left,
        };
    }

    updateSpanPosition() {
        const container = this.container;
        const span = this.span;
        if (container == null || span == null) {
            return;
        }
        const actualWidth = container.getBoundingClientRect().width;
        if (this.lastWidth == null || actualWidth !== this.lastWidth) {
            this.lastWidth = actualWidth;
            const { width, left } = this.getSpanPosition(actualWidth);
            span.style.width = `${width}px`;
            span.style.left = `${left}px`;
        }
    }

    render(): React.Node {
        const { node } = this.props;
        return (
            <div ref={x => (this.container = x)} className={cn("container")}>
                <div
                    ref={x => (this.span = x)}
                    className={cn("time-span")}
                    style={{
                        backgroundColor: Colors[node.colorConfig].background,
                    }}
                />
            </div>
        );
    }
}
