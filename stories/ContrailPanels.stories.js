// @flow
import React from "react";
import { storiesOf } from "@storybook/react";

import {
    ContrailPanelsContainer,
    ContrailPanelsTop,
    ContrailPanelsBottom,
    ContrailPanelsBottomLeft,
    ContrailPanelsBottomRight,
} from "../src/components/ContrailPanels";
import "../src/styles/root.less";

storiesOf("ContrailPanels", module).add("Default", () =>
    <ContrailPanelsContainer>
        <ContrailPanelsTop>Top</ContrailPanelsTop>
        <ContrailPanelsBottom>
            <ContrailPanelsBottomLeft>Left</ContrailPanelsBottomLeft>
            <ContrailPanelsBottomRight>Right</ContrailPanelsBottomRight>
        </ContrailPanelsBottom>
    </ContrailPanelsContainer>
);
