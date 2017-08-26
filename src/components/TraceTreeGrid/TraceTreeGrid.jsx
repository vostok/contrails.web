// @flow
import * as React from "react";

import type { SpanNode } from "../../Domain/TraceTree/SpanNode";
import Colors from "../../Domain/Colors";
import { millisecondsToString } from "../../Domain/TimeUtils";
import TreeGrid from "../TreeGrid/TreeGrid";

type TraceTreeGridProps = {
    traceTree: SpanNode,
    focusedItem?: ?SpanNode,
    onChangeFocusedItem?: (spanNode: SpanNode) => void,
    onItemClick?: (spanNode: SpanNode) => void,
};

type TraceTreeGridState = {};

export default class TraceTreeGrid extends React.Component<TraceTreeGridProps, TraceTreeGridState> {
    props: TraceTreeGridProps;
    state: TraceTreeGridState;

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
        // TODO вынести в домен
        // TODO учесть перекрытие детей
        return Math.max(
            0,
            spanNode.to -
                spanNode.from -
                spanNode.children.map(x => x.to - x.from).reduce((result, value) => result + value, 0)
        );
    }

    renderPercentageAndTime(time: number, percentage: number): React.Node {
        return [
            <div
                style={{
                    backgroundColor: "#FFEFBF",
                    position: "absolute",
                    top: 1,
                    right: 1,
                    width: Math.round((140 - 2) * percentage),
                    bottom: 1,
                }}
            />,
            <span style={{ position: "relative", color: "#000000" }}>
                {millisecondsToString(time, "0")}
                <span style={{ color: "#999", marginLeft: "5px", width: "50" }}>
                    {Math.round(percentage * 1000) / 10}%
                </span>
            </span>,
        ];
    }

    render(): React.Node {
        const { traceTree, onItemClick, onChangeFocusedItem, focusedItem } = this.props;
        return (
            <TreeGrid
                focusedItem={focusedItem}
                columns={[
                    {
                        name: "totalTime",
                        width: 120,
                        align: "right",
                        renderHeader: () => "Total time",
                        renderValue: x =>
                            this.renderPercentageAndTime(x.to - x.from, this.getSpanNodeTotalTimePrecentage(x)),
                    },
                    {
                        name: "selfTime",
                        width: 120,
                        align: "right",
                        renderHeader: () => "Self time",
                        renderValue: x =>
                            this.renderPercentageAndTime(
                                this.getSpanNodeSelfTime(x),
                                this.getSpanNodeSelfTimePrecentage(x)
                            ),
                    },
                    {
                        name: "service",
                        renderHeader: () => "Service",
                        renderValue: x => x.serviceName,
                        mainCell: true,
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
