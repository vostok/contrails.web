// @flow
import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import ProfilerChart from "../src/components/ProfilerChart";

type ProfilerItem = {
    from: number,
    to: number,
    name: string,
};

function handleCustomDrawItem(context: CanvasRenderingContext2D, item: ProfilerItem) {
    context.save();
    try {
        context.fillStyle = "#000";
        context.font = "14px Segoe UI";
        context.fillText(item.name, 0, 12);
    } finally {
        context.restore();
    }
}

const item2 = { from: 2, to: 4, name: "Item 2" };

storiesOf("ProfilerChart", module)
    .add("Default", () =>
        <ProfilerChart
            onCustomDrawItem={handleCustomDrawItem}
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
    .add("OneLineSpaces", () =>
        <ProfilerChart
            onItemClick={action("onItemClick")}
            selectedItems={[item2]}
            onCustomDrawItem={handleCustomDrawItem}
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
    .add("NonZeroFrom", () =>
        <ProfilerChart
            onItemClick={action("onItemClick")}
            selectedItems={[item2]}
            onCustomDrawItem={handleCustomDrawItem}
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
