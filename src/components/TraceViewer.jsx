// @flow
import * as React from "react";
import moment from "moment";
import glamurous from "glamorous";

import type { TraceInfo } from "../Domain/TraceInfo";
import type { SpanNode } from "../Domain/TraceTree/SpanNode";
import SpansToLinesArranger from "../Domain/SpanLines/SpansToLinesArranger";
import type { SpanLines } from "../Domain/SpanLines/SpansToLinesArranger";
import handleCustomDrawItem from "../Domain/ItemDrawer";
import TraceTreeBuilder from "../Domain/TraceTree/TraceTreeBuilder";

import {
    ContrailPanelsContainer,
    ContrailPanelsTop,
    ContrailPanelsBottom,
    ContrailPanelsBottomLeft,
    ContrailPanelsBottomRight,
} from "./ContrailPanels";
import ProfilerChartWithMinimap from "./ProfilerChartWithMinimap";
import TraceTreeGrid from "./TraceTreeGrid";
import SpanInfoView from "./SpanInfoView";

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
};

function min(x: number, y: number): number {
    return Math.min(x, y);
}

function max(x: number, y: number): number {
    return Math.max(x, y);
}

export default class TraceViewer extends React.Component<TraceViewerProps, TraceViewerState> {
    props: TraceViewerProps;
    state: TraceViewerState;

    constructor(props: TraceViewerProps) {
        super(props);
        const traceTree = new TraceTreeBuilder().buildTraceTree(props.traceInfo.Spans);
        this.state = {
            focusedSpanNode: null,
            traceTree: new TraceTreeBuilder().buildTraceTree(props.traceInfo.Spans),
            spanLines: this.generateDataFromDiTraceResponse(traceTree),
        };
    }

    generateDataFromDiTraceResponse(traceTree: SpanNode): ChartData {
        const arranger = new SpansToLinesArranger();
        return { lines: arranger.arrange(traceTree) };
    }

    getFromAndTo(traceInfo: TraceInfo): { from: number, to: number } {
        const spans = traceInfo.Spans;
        const result = {
            from: spans.map(x => x.BeginTimestamp).map(x => moment(x)).map(x => x.valueOf()).reduce(min),
            to: spans.map(x => x.EndTimestamp).map(x => moment(x)).map(x => x.valueOf()).reduce(max),
        };
        return result;
    }

    handleItemClick = (spanNode: SpanNode) => {
        this.setState({ focusedSpanNode: spanNode });
    };

    render(): React.Node {
        const { traceInfo } = this.props;
        const { traceTree, focusedSpanNode, spanLines } = this.state;
        return (
            <ContrailPanelsContainer>
                <ContrailPanelsTop>
                    <ProfilerChartWithMinimap
                        onCustomDrawItem={handleCustomDrawItem}
                        {...this.getFromAndTo(traceInfo)}
                        data={spanLines}
                    />
                </ContrailPanelsTop>
                <ContrailPanelsBottom>
                    <ContrailPanelsBottomLeft>
                        <TraceTreeGrid traceTree={traceTree} onItemClick={this.handleItemClick} />{" "}
                    </ContrailPanelsBottomLeft>
                    <ContrailPanelsBottomRight>
                        <SpanInfoViewContainer>
                            {focusedSpanNode && <SpanInfoView spanInfo={focusedSpanNode.source} />}
                        </SpanInfoViewContainer>
                    </ContrailPanelsBottomRight>
                </ContrailPanelsBottom>
            </ContrailPanelsContainer>
        );
    }
}

const SpanInfoViewContainer = glamurous.div({
    padding: 10,
});
