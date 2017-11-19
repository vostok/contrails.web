// @flow
import * as React from "react";
import { connect } from "react-redux";

import type { TraceInfo } from "../../Domain/TraceInfo";
import { TraceInfoUtils } from "../../Domain/TraceInfo";
import type { SpanInfo } from "../../Domain/SpanInfo";
import type { EnrichedSpanInfo } from "../../Domain/EnrichedSpanInfo";
import CustomItemDrawer from "../../Domain/CustomItemDrawer/CustomItemDrawer";
import itemColors from "../../Domain/Colors";
import TraceTreeBuilder from "../../Domain/TraceTree/TraceTreeBuilder";
import type { SpanFactory } from "../../Domain/TraceTree/LostSpanFixer";
import type { IDataExtractor } from "../../Domain/IDataExtractor";
import {
    ContrailPanelsContainer,
    ContrailPanelsTop,
    ContrailPanelsBottom,
    ContrailPanelsBottomLeft,
    ContrailPanelsBottomRight,
} from "../ContrailPanels/ContrailPanels";
import ProfilerChartWithMinimap from "../ProfilerChartWithMinimap/ProfilerChartWithMinimap";
import TraceTreeGrid from "../TraceTreeGrid/TraceTreeGrid";
import SpanInfoView from "../SpanInfoView/SpanInfoView";
import Tabs from "../Tabs/Tabs";
import SpansToLinesArranger2 from "../../Domain/SpanLines/SpansToLinesArranger2";
import { buildTree, transformTree } from "../../Domain/TreeTransformation";
import { AddSimplifiedBoundsToNodeTrasformer, AddColorConfigNodeTrasformer } from "../../Domain/SpanInfoTransformers";

import cn from "./TraceViewer.less";

type TimeRange = { from: number, to: number };

type SpanLines = Array<{ items: Array<EnrichedSpanInfo> }>;

type ChartData = {
    lines: SpanLines,
};

type TraceViewerProps = {
    traceInfo: TraceInfo,
    dataExtractor: IDataExtractor,
    onChangeViewPort: TimeRange => void,
};

type TraceViewerState = {
    focusedSpanNode: ?EnrichedSpanInfo,
    traceTree: EnrichedSpanInfo,
    spanLines: ChartData,
    timeRange: TimeRange,
    viewPort: TimeRange,
};

function fakeSpanFactory(traceId: string): SpanFactory<SpanInfo> {
    return (spanId: string, parentSpanId: ?string, beginTimestamp: string, endTimestamp: string): SpanInfo => ({
        TraceId: traceId,
        SpanId: spanId,
        ParentSpanId: parentSpanId,
        OperationName: "FakeSpan",
        BeginTimestamp: beginTimestamp,
        EndTimestamp: endTimestamp,
        Annotations: {},
    });
}

class TraceViewer extends React.Component<TraceViewerProps, TraceViewerState> {
    props: TraceViewerProps;
    state: TraceViewerState;

    constructor(props: TraceViewerProps) {
        super(props);
        const spans = props.traceInfo.Spans;
        const tree = buildTree(spans)[0];
        const arranger = new SpansToLinesArranger2();
        const transformedTree = transformTree(tree, [
            new AddSimplifiedBoundsToNodeTrasformer(),
            new AddColorConfigNodeTrasformer(),
        ]);
        const lines = arranger.arrange(transformedTree);
        this.state = {
            focusedSpanNode: null,
            traceTree: transformedTree,
            spanNodesMap: TraceTreeBuilder.buildNodeMap(transformedTree),
            spanLines: { lines: lines },
            timeRange: this.getFromAndTo(props.traceInfo),
            viewPort: this.getFromAndTo(props.traceInfo),
        };
        props.onChangeViewPort(this.getFromAndTo(props.traceInfo));
    }

    getFromAndTo(traceInfo: TraceInfo): { from: number, to: number } {
        return TraceInfoUtils.getTraceTimeRange(traceInfo);
    }

    handleTreeGridChangeFocusedItems = (spanNode: SpanNode) => {
        this.setState({ focusedSpanNode: spanNode });
    };

    handleChartItemClick = (spanLineItem: SpanLineItem) => {
        this.setState({ focusedSpanNode: spanLineItem.source });
    };

    getSelectedSpanLineItem(): Array<SpanLineItem> {
        const { focusedSpanNode, spanLines } = this.state;
        if (focusedSpanNode == null) {
            return [];
        }
        for (const line of spanLines.lines) {
            for (const item of line.items) {
                if (item.source === focusedSpanNode) {
                    return [item];
                }
            }
        }
        return [];
    }

    renderFullCallStack = (): React.Node => {
        const { traceTree, focusedSpanNode, timeRange } = this.state;
        return (
            <TraceTreeGrid
                totalTimeRange={timeRange}
                focusedItem={focusedSpanNode}
                traceTree={traceTree}
                onItemClick={this.handleTreeGridChangeFocusedItems}
                onChangeFocusedItem={this.handleTreeGridChangeFocusedItems}
            />
        );
    };

    renderCallStack = (): React.Node => {
        const { viewPort, traceTree, focusedSpanNode } = this.state;
        return (
            <TraceTreeGrid
                filterNodes={x =>
                    (viewPort.from < x.from && x.from < viewPort.to) ||
                    (viewPort.from < x.to && x.to < viewPort.to) ||
                    (x.from < viewPort.from && viewPort.to < x.to)
                }
                totalTimeRange={null}
                focusedItem={focusedSpanNode}
                traceTree={traceTree}
                onItemClick={this.handleTreeGridChangeFocusedItems}
                onChangeFocusedItem={this.handleTreeGridChangeFocusedItems}
            />
        );
    };

    handleGetMinimapItemColor = (item: SpanLineItem): ?string => itemColors[item.colorConfig].background;

    render(): React.Node {
        const { onChangeViewPort } = this.props;
        const { traceTree, focusedSpanNode, spanLines, timeRange } = this.state;
        return (
            <ContrailPanelsContainer>
                <ContrailPanelsTop>
                    <ProfilerChartWithMinimap
                        selectedItems={this.getSelectedSpanLineItem()}
                        onItemClick={this.handleChartItemClick}
                        onGetMinimapColor={this.handleGetMinimapItemColor}
                        itemDrawer={new CustomItemDrawer()}
                        from={timeRange.from}
                        to={timeRange.to}
                        data={spanLines}
                        onChangeViewPort={viewPort => {
                            this.setState({ viewPort: viewPort });
                            onChangeViewPort(viewPort);
                        }}
                    />
                </ContrailPanelsTop>
                <ContrailPanelsBottom>
                    <ContrailPanelsBottomLeft>
                        <Tabs
                            tabs={[
                                {
                                    name: "FullCallStack",
                                    caption: "Full call stack",
                                    renderContent: this.renderFullCallStack,
                                },
                                {
                                    name: "CallStack",
                                    caption: "Call stack",
                                    renderContent: this.renderCallStack,
                                },
                            ]}
                        />
                    </ContrailPanelsBottomLeft>
                    <ContrailPanelsBottomRight>
                        <div className={cn("span-info-view-container")}>
                            {focusedSpanNode != null && <SpanInfoView root={traceTree} span={focusedSpanNode} />}
                        </div>
                    </ContrailPanelsBottomRight>
                </ContrailPanelsBottom>
            </ContrailPanelsContainer>
        );
    }
}

export default connect(
    () => ({}),
    dispatch => ({
        onChangeViewPort: viewPort => dispatch({ type: "ChangeViewPort", viewPort: viewPort }),
    })
)(TraceViewer);
