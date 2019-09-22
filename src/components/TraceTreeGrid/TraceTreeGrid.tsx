import * as React from "react";
import { connect } from "react-redux";

import { Colors } from "../../Domain/Colors";
import { DateTimeUtils } from "../../Domain/DateTimeUtils";
import { TimeRange } from "../../Domain/TimeRange";
import { SpanNode } from "../../Domain/TraceTree/SpanNode";
import { TraceTreeUtils } from "../../Domain/TraceTree/TraceTreeUtils";
import { ContrailsApplicationState } from "../../Store/ContrailsApplicationState";
import { SpanNodeTimeLine } from "../SpanNodeTimeLine/SpanNodeTimeLine";
import { TreeGrid, withExpandedItems } from "../TreeGrid/TreeGrid";

import cn from "./TraceTreeGrid.less";

// tslint:disable-next-line no-inferred-empty-object-type Тут tslint тупит, всё нормально
const TreeGridWithState = withExpandedItems(TreeGrid);

const SpanNodeTimeLineOfViewPort = connect((state: ContrailsApplicationState) => ({ totalTimeRange: state.viewPort }))(
    SpanNodeTimeLine
);

interface TraceTreeGridProps {
    filterNodes: (node: SpanNode) => boolean;
    totalTimeRange: undefined | TimeRange;
    traceTree: SpanNode;
    focusedItem?: undefined | SpanNode;
    onChangeFocusedItem: (spanNode: SpanNode) => void;
    onItemClick?: (spanNode: SpanNode) => void;
}

export class TraceTreeGrid extends React.Component<TraceTreeGridProps> {
    public static defaultProps = {
        filterNodes: () => true,
    };
    public getSpanNodeSelfTimeCache: { [spanId: string]: number } = {};

    public getSpanNodeTotalTimePercentage(spanNode: SpanNode): number {
        const { traceTree } = this.props;
        const rootNodeTotalTile = traceTree.to - traceTree.from;
        return (spanNode.to - spanNode.from) / rootNodeTotalTile;
    }

    public getSpanNodeSelfTimePercentage(spanNode: SpanNode): number {
        const { traceTree } = this.props;
        const rootNodeTotalTile = traceTree.to - traceTree.from;
        return this.getSpanNodeSelfTime(spanNode) / rootNodeTotalTile;
    }

    public getSpanNodeSelfTime(spanNode: SpanNode): number {
        const spanId = spanNode.source.SpanId;
        if (this.getSpanNodeSelfTimeCache[spanId] == undefined) {
            this.getSpanNodeSelfTimeCache[spanId] = TraceTreeUtils.getSpanNodeSelfTime(spanNode);
        }
        return this.getSpanNodeSelfTimeCache[spanId];
    }

    public renderPercentageAndTime(time: number, percentage: number, focused: boolean): React.ReactNode {
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

    public renderTimeLine(node: SpanNode): JSX.Element {
        const { totalTimeRange } = this.props;
        if (totalTimeRange == undefined) {
            return <SpanNodeTimeLineOfViewPort node={node} />;
        }
        return <SpanNodeTimeLine node={node} totalTimeRange={totalTimeRange} />;
    }

    public render(): JSX.Element {
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
                                this.getSpanNodeTotalTimePercentage(x),
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
                                this.getSpanNodeSelfTimePercentage(x),
                                focused
                            ),
                    },
                    {
                        name: "service",
                        width: 300,
                        cellClassName: cn("service-cell"),
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
