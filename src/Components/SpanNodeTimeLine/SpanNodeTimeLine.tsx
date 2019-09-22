import * as React from "react";

import { Colors } from "../../Domain/Colors";
import { TimeRange } from "../../Domain/TimeRange";
import { SpanNode } from "../../Domain/TraceTree/SpanNode";

import cn from "./SpanNodeTimeLine.less";

interface SpanNodeTimeLineProps {
    node: SpanNode;
    totalTimeRange?: TimeRange;
}

export class SpanNodeTimeLine extends React.Component<SpanNodeTimeLineProps> {
    // @ts-ignore Разобрать почему там ниже закоментировано
    private lastWidth?: null | number;
    private container?: null | HTMLElement;
    private span?: null | HTMLElement;

    public componentDidUpdate(): void {
        this.updateSpanPosition();
    }

    public componentDidMount(): void {
        this.updateSpanPosition();
    }

    public componentWillReceiveProps(): void {
        this.updateSpanPosition();
    }

    public getSpanPosition(containerWidth: number): undefined | { width: number; left: number } {
        const { node, totalTimeRange } = this.props;
        if (totalTimeRange == undefined) {
            return undefined;
        }
        const timeRangeDuration = totalTimeRange.to - totalTimeRange.from;
        const nodeDuration = node.to - node.from;
        const left = Math.round(((node.from - totalTimeRange.from) / timeRangeDuration) * containerWidth);
        const width = Math.max(4, (nodeDuration / timeRangeDuration) * containerWidth);
        return {
            width: width,
            left: left,
        };
    }

    public updateSpanPosition(): void {
        const container = this.container;
        const span = this.span;
        if (container == undefined || span == undefined) {
            return;
        }
        const actualWidth = container.getBoundingClientRect().width;
        // if (this.lastWidth == null || actualWidth !== this.lastWidth) {
        this.lastWidth = actualWidth;
        const spanPosition = this.getSpanPosition(actualWidth);
        if (spanPosition == undefined) {
            return;
        }
        const { width, left } = spanPosition;
        span.style.width = `${width}px`;
        span.style.left = `${left}px`;
        // }
    }

    public render(): JSX.Element {
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
