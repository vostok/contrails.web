import * as React from "react";
import { connect } from "react-redux";

import { Colors } from "../../Domain/Colors";
import { SpanNodeTimeUtils } from "../../Domain/SpanNodeTimeUtils";
import { TimeRange } from "../../Domain/TimeRange";
import { SpanNode } from "../../Domain/TraceTree/SpanNode";
import { ContrailsApplicationState } from "../../Store/ContrailsApplicationState";
import { SpanNodeTimeLine } from "../SpanNodeTimeLine/SpanNodeTimeLine";
import { ColumnDefinition, TreeGrid, TreeGridProps } from "../TreeGrid/TreeGrid";

import { PercentageAndTimeBar } from "./PercentageAndTimeBar/PercentageAndTimeBar";
import cn from "./TraceTreeGrid.less";

function TreeGridWithState(
    props: Omit<TreeGridProps<SpanNode>, "onChangeExpandedItems" | "expandedItems">
): JSX.Element {
    const [expandedItems, setExpandedItems] = React.useState<SpanNode[]>([]);
    return <TreeGrid {...props} onChangeExpandedItems={setExpandedItems} expandedItems={expandedItems} />;
}

const SpanNodeTimeLineOfViewPort = connect((state: ContrailsApplicationState) => ({ totalTimeRange: state.viewPort }))(
    SpanNodeTimeLine
);

interface TraceTreeGridProps {
    filterNodes?: (node: SpanNode) => boolean;
    totalTimeRange: undefined | TimeRange;
    traceTree: SpanNode;
    focusedItem?: undefined | SpanNode;
    onChangeFocusedItem: (spanNode: SpanNode) => void;
    onItemClick?: (spanNode: SpanNode) => void;
}

export function TraceTreeGrid(props: TraceTreeGridProps): JSX.Element {
    const { traceTree, onItemClick, onChangeFocusedItem, focusedItem, filterNodes, totalTimeRange } = props;

    const treeGridData = React.useMemo(() => [traceTree], [traceTree]);

    const columns = React.useMemo<Array<ColumnDefinition<SpanNode>>>(
        () => [
            {
                name: "totalTime",
                width: 140,
                align: "right",
                renderHeader: () => "Total time",
                renderValue: (x, focused, highlighted) => (
                    <PercentageAndTimeBar
                        faded={!highlighted}
                        time={SpanNodeTimeUtils.getSpanNodeTime(traceTree, x)}
                        percentage={SpanNodeTimeUtils.getSpanNodeTotalTimePercentage(traceTree, x)}
                        focused={focused}
                    />
                ),
            },
            {
                name: "selfTime",
                width: 140,
                align: "right",
                renderHeader: () => "Self time",
                renderValue: (x, focused, highlighted) => (
                    <PercentageAndTimeBar
                        faded={!highlighted}
                        time={SpanNodeTimeUtils.getSpanNodeSelfTime(traceTree, x)}
                        percentage={SpanNodeTimeUtils.getSpanNodeSelfTimePercentage(traceTree, x)}
                        focused={focused}
                    />
                ),
            },
            {
                name: "service",
                width: 300,
                cellClassName: cn("service-cell"),
                renderHeader: () => "Service",
                renderValue: (x, focused, highlighted) => (
                    <span className={cn({ faded: !highlighted })}>x.serviceName</span>
                ),
                mainCell: true,
            },
            {
                name: "timeline",
                renderHeader: () => "Timeline",
                renderValue: (x, focused, highlighted) => renderTimeLine(x, totalTimeRange, highlighted),
            },
        ],
        [traceTree]
    );

    const handleGetChildren = React.useCallback((x: SpanNode) => x.children, []);
    const handleGetItemColor = React.useCallback((x: SpanNode) => Colors[x.colorConfig].background, []);

    return (
        <TreeGridWithState
            highlightStack
            filterNodes={filterNodes}
            focusedItem={focusedItem}
            columns={columns}
            onGetChildren={handleGetChildren}
            onGetItemColor={handleGetItemColor}
            onChangeFocusedItem={onChangeFocusedItem}
            onItemClick={onItemClick}
            data={treeGridData}
        />
    );
}

function renderTimeLine(node: SpanNode, totalTimeRange: undefined | TimeRange, highlighted: boolean): JSX.Element {
    if (totalTimeRange == undefined) {
        return <SpanNodeTimeLineOfViewPort node={node} highlighted={highlighted} />;
    }
    return <SpanNodeTimeLine node={node} totalTimeRange={totalTimeRange} highlighted={highlighted} />;
}
