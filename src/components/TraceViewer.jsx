// @flow
import * as React from "react";
import moment from "moment";

import {
    ContrailPanelsContainer,
    ContrailPanelsTop,
    ContrailPanelsBottom,
    ContrailPanelsBottomLeft,
    ContrailPanelsBottomRight,
    ContrailPanelsFooter,
} from "../components/ContrailPanels";
import ProfilerChartWithMinimap from "../components/ProfilerChartWithMinimap";
import TraceTreeGrid from "../components/TraceTreeGrid";
import type { TraceInfo } from "../Domain/TraceInfo";
import type { SpanInfo } from "../Domain/SpanInfo";
import SpansToLinesArranger from "../Domain/SpansToLines";
import handleCustomDrawItem from "../Domain/ItemDrawer";
import { buildTraceTree } from "../Domain/TraceTree";

type TraceViewerProps = {
    traceInfo: TraceInfo,
};

type TraceViewerState = {};

function min(x: number, y: number): number {
    return Math.min(x, y);
}

function max(x: number, y: number): number {
    return Math.max(x, y);
}

export default class TraceViewer extends React.Component<TraceViewerProps, TraceViewerState> {
    props: TraceViewerProps;
    state: TraceViewerState;

    generateDataFromDiTraceResponse(response: TraceInfo): { lines: { items: SpanInfo[] }[] } {
        const arranger = new SpansToLinesArranger();
        const spans = response.Spans;
        return { lines: arranger.arrange(spans) };
    }

    getFromAndTo(traceInfo: TraceInfo): { from: number, to: number } {
        const spans = traceInfo.Spans;
        const result = {
            from: spans.map(x => x.BeginTimestamp).map(x => moment(x)).map(x => x.valueOf()).reduce(min),
            to: spans.map(x => x.EndTimestamp).map(x => moment(x)).map(x => x.valueOf()).reduce(max),
        };
        return result;
    }

    render(): React.Node {
        const { traceInfo } = this.props;
        return (
            <ContrailPanelsContainer>
                <ContrailPanelsTop>
                    <ProfilerChartWithMinimap
                        onCustomDrawItem={handleCustomDrawItem}
                        {...this.getFromAndTo(traceInfo)}
                        data={this.generateDataFromDiTraceResponse(traceInfo)}
                    />
                </ContrailPanelsTop>
                <ContrailPanelsBottom>
                    <ContrailPanelsBottomLeft>
                        <TraceTreeGrid traceTree={buildTraceTree(traceInfo.Spans)} />{" "}
                    </ContrailPanelsBottomLeft>
                    <ContrailPanelsBottomRight>Right</ContrailPanelsBottomRight>
                </ContrailPanelsBottom>
                <ContrailPanelsFooter />
            </ContrailPanelsContainer>
        );
    }
}
