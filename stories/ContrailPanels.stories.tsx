import { storiesOf } from "@storybook/react";
import * as React from "react";

import {
    ContrailPanelsBottom,
    ContrailPanelsBottomLeft,
    ContrailPanelsBottomRight,
    ContrailPanelsContainer,
    ContrailPanelsTop,
} from "../src/Components/ContrailPanels/ContrailPanels";

storiesOf("ContrailPanels", module).add("Default", () => (
    <ContrailPanelsContainer>
        <ContrailPanelsTop>Top</ContrailPanelsTop>
        <ContrailPanelsBottom>
            <ContrailPanelsBottomLeft>Left</ContrailPanelsBottomLeft>
            <ContrailPanelsBottomRight>Right</ContrailPanelsBottomRight>
        </ContrailPanelsBottom>
    </ContrailPanelsContainer>
));
