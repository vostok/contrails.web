// @flow
import * as React from "react";

import type { TraceInfo } from "../../Domain/TraceInfo";
import { TraceInfoUtils } from "../../Domain/TraceInfo";
import type { SpanInfo } from "../../Domain/SpanInfo";
import type { SpanNode } from "../../Domain/TraceTree/SpanNode";
import SpansToLinesArranger from "../../Domain/SpanLines/SpansToLinesArranger";
import type { SpanLines, SpanLineItem } from "../../Domain/SpanLines/SpansToLinesArranger";
import handleCustomDrawItem from "../../Domain/ItemDrawer";
import TraceTreeBuilder from "../../Domain/TraceTree/TraceTreeBuilder";
import LostSpanFixer from "../../Domain/TraceTree/LostSpanFixer";
import type { SpanFactory } from "../../Domain/TraceTree/LostSpanFixer";
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

import cn from "./TraceViewer.less";

type ChartData = {
    lines: SpanLines,
};

type TraceViewerProps = {
    traceInfo: TraceInfo,
};

type TraceViewerState = {
    focusedSpanNode: ?SpanNode,
    traceTree: SpanNode,
    spanLines: ChartData,
    timeRange: TimeRange,
    viewPort: TimeRange,
};

type TimeRange = { from: number, to: number };

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

export default class TraceViewer extends React.Component<TraceViewerProps, TraceViewerState> {
    props: TraceViewerProps;
    state: TraceViewerState;

    constructor(props: TraceViewerProps) {
        super(props);
        const treeBuilder = new TraceTreeBuilder();
        const lostSpanFixer = new LostSpanFixer();
        const recoveredSpan = lostSpanFixer.fix(props.traceInfo.Spans, fakeSpanFactory(props.traceInfo.TraceId));
        const traceTree = treeBuilder.buildTraceTree(recoveredSpan);
        this.state = {
            focusedSpanNode: null,
            traceTree: traceTree,
            spanNodesMap: treeBuilder.buildNodeMap(traceTree),
            spanLines: this.generateDataFromDiTraceResponse(traceTree),
            timeRange: this.getFromAndTo(props.traceInfo),
            viewPort: this.getFromAndTo(props.traceInfo),
        };
    }

    generateDataFromDiTraceResponse(traceTree: SpanNode): ChartData {
        const arranger = new SpansToLinesArranger();
        return { lines: arranger.arrange(traceTree) };
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
        const { traceTree, focusedSpanNode, viewPort } = this.state;
        return (
            <TraceTreeGrid
                totalTimeRange={viewPort}
                focusedItem={focusedSpanNode}
                traceTree={traceTree}
                onItemClick={this.handleTreeGridChangeFocusedItems}
                onChangeFocusedItem={this.handleTreeGridChangeFocusedItems}
            />
        );
    };

    render(): React.Node {
        const { traceTree, focusedSpanNode, spanLines, timeRange } = this.state;
        return (
            <ContrailPanelsContainer>
                <ContrailPanelsTop>
                    <ProfilerChartWithMinimap
                        selectedItems={this.getSelectedSpanLineItem()}
                        onItemClick={this.handleChartItemClick}
                        onCustomDrawItem={handleCustomDrawItem}
                        from={timeRange.from}
                        to={timeRange.to}
                        data={spanLines}
                        onChangeViewPort={value => this.setState({ viewPort: value })}
                    />
                </ContrailPanelsTop>
                <ContrailPanelsBottom>
                    <ContrailPanelsBottomLeft>
                        <Tabs
                            tabs={[
                                {
                                    name: "CallStack",
                                    caption: "Call stack",
                                    renderContent: this.renderCallStack,
                                },
                                {
                                    name: "FullCallStack",
                                    caption: "Full call stack",
                                    renderContent: this.renderFullCallStack,
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
