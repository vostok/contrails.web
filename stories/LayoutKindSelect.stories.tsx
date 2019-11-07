import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { LayoutKindSelect } from "../src/Components/LayoutKindSelect/LayoutKindSelect";
import { LayoutKind } from "../src/Containers/LayoutKind/LayoutKind";

storiesOf("LayoutKindSelect", module).add("Default", () => (
    <LayoutKindSelect value={LayoutKind.ChartWithMinimapAndTree} onChange={action("onChange")} />
));
