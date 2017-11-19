// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";

import ProfilerChartWithMinimap from "../../src/components/ProfilerChartWithMinimap/ProfilerChartWithMinimap";
import CustomItemDrawer from "../../src/Domain/CustomItemDrawer/CustomItemDrawer";
import Span from "../../test/Utils/Span";

import { buildDataFromSpans } from "./ProfilerChartDataUtils";

const itemDrawer = new CustomItemDrawer();

storiesOf("ProfilerChartWithMinimap/SampleSpanInfos", module).add("FullScreen-Data-1", () => (
    <ProfilerChartWithMinimap
        itemDrawer={itemDrawer}
        {...buildDataFromSpans(Span.create({ from: 0, to: 10 }).build())}
    />
));
