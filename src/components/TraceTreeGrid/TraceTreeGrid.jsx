// @flow
import * as React from "react";
import { connect } from "react-redux";

import type { EnrichedSpanInfo } from "../../Domain/EnrichedSpanInfo";
import TraceTreeUtils from "../../Domain/TraceTree/TraceTreeUtils";
import Colors from "../../Domain/Colors";
import DateTimeUtils from "../../Domain/DateTimeUtils";
import TreeGrid, { withExpandedItems } from "../TreeGrid/TreeGrid";
import type { TimeRange } from "../../Domain/TimeRange";
import SpanNodeTimeLine from "../SpanNodeTimeLine/SpanNodeTimeLine";
import type { ApplicationState } from "../../reducer/contrailsApplicationReducer";

import cn from "./TraceTreeGrid.less";

const TreeGridWithState = withExpandedItems(TreeGrid);

const SpanNodeTimeLineOfViewPort = connect(
    (state: ApplicationState) => ({ totalTimeRange: state.viewPort }),
    () => ({})
)(SpanNodeTimeLine);

type TraceTreeGridProps = {
    filterNodes: EnrichedSpanInfo => boolean,
    totalTimeRange: ?TimeRange,
    traceTree: EnrichedSpanInfo,
    focusedItem?: ?EnrichedSpanInfo,
    onChangeFocusedItem: (spanNode: EnrichedSpanInfo) => void,
    onItemClick?: (spanNode: EnrichedSpanInfo) => void,
};

type TraceTreeGridState = {};

export default class TraceTreeGrid extends React.Component<TraceTreeGridProps, TraceTreeGridState> {
    props: TraceTreeGridProps;
    state: TraceTreeGridState;
    static defaultProps = {
        filterNodes: () => true,
    };
    getSpanNodeSelfTimeCache: { [spanId: string]: number } = {};

    getSpanNodeTotalTimePrecentage(spanNode: EnrichedSpanInfo): number {
        const { traceTree } = this.props;
        const rootNodeTotalTile = traceTree.to - traceTree.from;
        return (spanNode.to - spanNode.from) / rootNodeTotalTile;
    }

    getSpanNodeSelfTimePrecentage(spanNode: EnrichedSpanInfo): number {
        const { traceTree } = this.props;
        const rootNodeTotalTile = traceTree.to - traceTree.from;
        return this.getSpanNodeSelfTime(spanNode) / rootNodeTotalTile;
    }

    getSpanNodeSelfTime(spanNode: EnrichedSpanInfo): number {
        const spanId = spanNode.type === "RemoteCallSpan" ? spanNode.SpanId : spanNode.SpanId;
        if (this.getSpanNodeSelfTimeCache[spanId] == null) {
            this.getSpanNodeSelfTimeCache[spanId] = TraceTreeUtils.getSpanNodeSelfTime(spanNode);
        }
        return this.getSpanNodeSelfTimeCache[spanId];
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

    renderTimeLine(node: EnrichedSpanInfo): React.Node {
        const { totalTimeRange } = this.props;
        if (totalTimeRange == null) {
            return <SpanNodeTimeLineOfViewPort node={node} />;
        }
        return <SpanNodeTimeLine node={node} totalTimeRange={totalTimeRange} />;
    }

    render(): React.Node {
        const { traceTree, onItemClick, onChangeFocusedItem, focusedItem, filterNodes } = this.props;
        return (
            <TreeGridWithState
                filterNodes={filterNodes}
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
                        // TODO Fix
                        // @flow-disable-next-line
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
