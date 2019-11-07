import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Tabs } from "../src/Components/Tabs/Tabs";

function renderContent(): React.ReactNode {
    return "tab-content";
}

storiesOf("Tabs", module)
    .add("SimpleOneTab", () => (
        <Tabs
            tabs={[
                {
                    name: "1",
                    caption: "Tab 1",
                    renderContent: renderContent,
                },
            ]}
        />
    ))
    .add("TwoTabs", () => (
        <Tabs
            tabs={[
                {
                    name: "1",
                    caption: "Tab 1",
                    renderContent: renderContent,
                },
                {
                    name: "2",
                    caption: "Tab 2",
                    renderContent: renderContent,
                },
            ]}
        />
    ));
