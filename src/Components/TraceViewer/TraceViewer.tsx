import * as React from "react";

import { CallTreeContainer } from "../../Containers/CallTreeContainer";
import { FullCallTreeContainer } from "../../Containers/FullCallTreeContainer";
import { ProfilerChartWithMinimapContainer } from "../../Containers/ProfilerChartWithMinimapContainer";
import { SpanInfoViewContainer } from "../../Containers/SpanInfoViewContainer";
import {
    ContrailPanelsBottom,
    ContrailPanelsBottomLeft,
    ContrailPanelsBottomRight,
    ContrailPanelsContainer,
    ContrailPanelsTop,
} from "../ContrailPanels/ContrailPanels";
import { Tabs } from "../Tabs/Tabs";

import cn from "./TraceViewer.less";

export function TraceViewer(): JSX.Element {
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
                        <SpanInfoViewContainer />
                    </div>
                </ContrailPanelsBottomRight>
            </ContrailPanelsBottom>
        </ContrailPanelsContainer>
    );
}
