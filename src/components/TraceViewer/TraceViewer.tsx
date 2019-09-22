import * as React from "react";
import { connect } from "react-redux";

import { SpanNode } from "../../Domain/TraceTree/SpanNode";
import { ContrailsApplicationState } from "../../Store/ContrailsApplicationState";
import {
    ContrailPanelsBottom,
    ContrailPanelsBottomLeft,
    ContrailPanelsBottomRight,
    ContrailPanelsContainer,
    ContrailPanelsTop,
} from "../ContrailPanels/ContrailPanels";
import { ProfilerChartWithMinimapContainer } from "../ProfilerChartWithMinimap/ProfilerChartWithMinimapContainer";
import { SpanInfoViewContainer } from "../SpanInfoView/SpanInfoViewContainer";
import { Tabs } from "../Tabs/Tabs";
import { CallTreeContainer } from "../TraceTreeGrid/CallTreeContainer";
import { FullCallTreeContainer } from "../TraceTreeGrid/FullCallTreeContainer";

import cn from "./TraceViewer.less";

interface TraceViewerProps {
    focusedSpanNode?: SpanNode;
}

export function TraceViewer(props: TraceViewerProps): JSX.Element {
    const { focusedSpanNode } = props;

    return (
        <ContrailPanelsContainer>
            <ContrailPanelsTop>
                <ProfilerChartWithMinimapContainer />
            </ContrailPanelsTop>
            <ContrailPanelsBottom>
                <ContrailPanelsBottomLeft>
                    <Tabs
                        tabs={[
                            {
                                name: "FullCallStack",
                                caption: "Full call stack",
                                renderContent: () => <FullCallTreeContainer />,
                            },
                            {
                                name: "CallStack",
                                caption: "Call stack",
                                renderContent: () => <CallTreeContainer />,
                            },
                        ]}
                    />
                </ContrailPanelsBottomLeft>
                <ContrailPanelsBottomRight>
                    <div className={cn("span-info-view-container")}>
                        {focusedSpanNode != undefined && <SpanInfoViewContainer />}
                    </div>
                </ContrailPanelsBottomRight>
            </ContrailPanelsBottom>
        </ContrailPanelsContainer>
    );
}

const mapProps = (state: ContrailsApplicationState) => ({
    focusedSpanNode: state.focusedSpanNode,
});

export const TraceViewerContainer = connect(mapProps)(TraceViewer);
