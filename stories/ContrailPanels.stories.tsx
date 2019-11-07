import { storiesOf } from "@storybook/react";
import * as React from "react";

import {
    ContrailPanelsBottom,
    ContrailPanelsBottomLeft,
    ContrailPanelsBottomRight,
    ContrailPanelsContainer,
    ContrailPanelsTop,
} from "../src/Components/ContrailPanels/ContrailPanels";
import { LayoutKind } from "../src/Containers/LayoutKind/LayoutKind";

storiesOf("ContrailPanels", module).add("Default", () => (
    <ContrailPanelsContainer layoutKind={LayoutKind.ChartWithMinimapAndTree}>
        <ContrailPanelsTop>Top</ContrailPanelsTop>
        <ContrailPanelsBottom>
            <ContrailPanelsBottomLeft>Left</ContrailPanelsBottomLeft>
            <ContrailPanelsBottomRight>Right</ContrailPanelsBottomRight>
        </ContrailPanelsBottom>
    </ContrailPanelsContainer>
));
