// @flow
import * as React from "react";
import { connect } from "react-redux";

import type { SpanNode } from "../../Domain/TraceTree/SpanNode";
import TraceTreeUtils from "../../Domain/TraceTree/TraceTreeUtils";
import Colors from "../../Domain/Colors";
import DateTimeUtils from "../../Domain/DateTimeUtils";
import TreeGrid, { withExpandedItems } from "../TreeGrid/TreeGrid";
import type { TimeRange } from "../../Domain/TimeRange";
import SpanNodeTimeLine from "../SpanNodeTimeLine/SpanNodeTimeLine";

import cn from "./TraceTreeGrid.less";

const TreeGridWithState = withExpandedItems(TreeGrid);

const SpanNodeTimeLineOfViewPort = connect(state => ({ totalTimeRange: state.viewPort }))(SpanNodeTimeLine);

type TraceTreeGridProps = {
    totalTimeRange: ?TimeRange,
    traceTree: SpanNode,
    focusedItem?: ?SpanNode,
    onChangeFocusedItem: (spanNode: SpanNode) => void,
    onItemClick?: (spanNode: SpanNode) => void,
};

type TraceTreeGridState = {};

export default class TraceTreeGrid extends React.Component<TraceTreeGridProps, TraceTreeGridState> {
    props: TraceTreeGridProps;
    state: TraceTreeGridState;
    getSpanNodeSelfTimeCache: { [spanId: string]: number } = {};

    getSpanNodeTotalTimePrecentage(spanNode: SpanNode): number {
        const { traceTree } = this.props;
        const rootNodeTotalTile = traceTree.to - traceTree.from;
        return (spanNode.to - spanNode.from) / rootNodeTotalTile;
    }

    getSpanNodeSelfTimePrecentage(spanNode: SpanNode): number {
        const { traceTree } = this.props;
        const rootNodeTotalTile = traceTree.to - traceTree.from;
        return this.getSpanNodeSelfTime(spanNode) / rootNodeTotalTile;
    }

    getSpanNodeSelfTime(spanNode: SpanNode): number {
        if (this.getSpanNodeSelfTimeCache[spanNode.source.SpanId] == null) {
            this.getSpanNodeSelfTimeCache[spanNode.source.SpanId] = TraceTreeUtils.getSpanNodeSelfTime(spanNode);
        }
        return this.getSpanNodeSelfTimeCache[spanNode.source.SpanId];
    }

    renderPercentageAndTime(time: number, percentage: number, focused: boolean): React.Node {
        return [
            <div
                key="BarChart"
                className={cn("cell-bar-chart")}
                style={{
                    width: Math.round((140 - 8) * percentage),
                }}
            />,
            <span key="Value" className={cn("cell-values", { focused: focused })}>
                <span className={cn("value")}>{DateTimeUtils.millisecondsToString(time, "0")}</span>
                <span className={cn("percentage")}>{Math.round(percentage * 1000) / 10}%</span>
            </span>,
        ];
    }

    renderTimeLine(node: SpanNode): React.Node {
        const { totalTimeRange } = this.props;
        if (totalTimeRange == null) {
            return <SpanNodeTimeLineOfViewPort node={node} />;
        }
        return <SpanNodeTimeLine node={node} totalTimeRange={totalTimeRange} />;
    }

    render(): React.Node {
        const { traceTree, onItemClick, onChangeFocusedItem, focusedItem } = this.props;
        return (
            <TreeGridWithState
                focusedItem={focusedItem}
                columns={[
                    {
                        name: "totalTime",
                        width: 140,
                        align: "right",
                        renderHeader: () => "Total time",
                        renderValue: (x, focused) =>
                            this.renderPercentageAndTime(
                                x.to - x.from,
                                this.getSpanNodeTotalTimePrecentage(x),
                                focused
                            ),
                    },
                    {
                        name: "selfTime",
                        width: 140,
                        align: "right",
                        renderHeader: () => "Self time",
                        renderValue: (x, focused) =>
                            this.renderPercentageAndTime(
                                this.getSpanNodeSelfTime(x),
                                this.getSpanNodeSelfTimePrecentage(x),
                                focused
                            ),
                    },
                    {
                        name: "service",
                        width: 300,
                        cellClassName: cn("servive-cell"),
                        renderHeader: () => "Service",
                        renderValue: x => x.serviceName,
                        mainCell: true,
                    },
                    {
                        name: "timeline",
                        renderHeader: () => "Timeline",
                        renderValue: x => this.renderTimeLine(x),
                    },
                ]}
                onGetChildren={x => x.children}
                onGetItemColor={x => Colors[x.colorConfig].background}
                onChangeFocusedItem={onChangeFocusedItem}
                onItemClick={onItemClick}
                data={[traceTree]}
            />
        );
    }
}
