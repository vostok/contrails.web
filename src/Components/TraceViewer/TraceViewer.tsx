import * as React from "react";
import { connect } from "react-redux";

import { CallTreeContainer } from "../../Containers/CallTreeContainer";
import { FullCallTreeContainer } from "../../Containers/FullCallTreeContainer";
import { ProfilerChartWithMinimapContainer } from "../../Containers/ProfilerChartWithMinimapContainer";
import { SpanInfoViewContainer } from "../../Containers/SpanInfoViewContainer";
import { SpanNode } from "../../Domain/TraceTree/SpanNode";
import { ContrailsApplicationState } from "../../Store/ContrailsApplicationState";
import {
    ContrailPanelsBottom,
    ContrailPanelsBottomLeft,
    ContrailPanelsBottomRight,
    ContrailPanelsContainer,
    ContrailPanelsTop,
} from "../ContrailPanels/ContrailPanels";
import { Tabs } from "../Tabs/Tabs";

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
                                name: "FullCallTree",
                                caption: "Full call tree",
                                renderContent: () => <FullCallTreeContainer />,
                            },
                            {
                                name: "CallTree",
                                caption: "Call tree",
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
