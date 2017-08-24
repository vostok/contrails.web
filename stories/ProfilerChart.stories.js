// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import ProfilerChart from "../src/components/ProfilerChart/ProfilerChart";

const item2 = { from: 2, to: 4, name: "Item 2" };

storiesOf("ProfilerChart", module)
    .add("OneLineSpaces", () =>
        <ProfilerChart
            onItemClick={action("onItemClick")}
            selectedItems={[item2]}
            from={0}
            to={5}
            xScale={100}
            data={{
                lines: [
                    {
                        items: [{ from: 0, to: 2, name: "Item 1" }, item2, { from: 4, to: 6, name: "Item 3" }],
                    },
                ],
            }}
        />
    )
    .add("Default", () =>
        <ProfilerChart
            from={0}
            to={5}
            xScale={100}
            data={{
                lines: [
                    {
                        items: [{ from: 0, to: 2, name: "123" }, { from: 2.1, to: 3.993, name: "123" }],
                    },
                    {
                        items: [{ from: 0.5, to: 2, name: "123" }, { from: 2.6, to: 3.9, name: "123" }],
                    },
                    {
                        items: [{ from: 1, to: 1.5, name: "123" }, { from: 2, to: 2.9, name: "123" }],
                    },
                ],
            }}
        />
    )
    .add("NonZeroFrom", () =>
        <ProfilerChart
            onItemClick={action("onItemClick")}
            selectedItems={[item2]}
            from={10}
            to={20}
            xScale={100}
            data={{
                lines: [
                    {
                        items: [{ from: 11, to: 19, name: "Item 1" }],
                    },
                ],
            }}
        />
    );
