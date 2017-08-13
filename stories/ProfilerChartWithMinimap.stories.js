// @flow
import React from "react";
import glamorous from "glamorous";
import { storiesOf } from "@storybook/react";

import ProfilerChartWithMinimap from "../src/components/ProfilerChartWithMinimap";

import generateProfilerData from "./Utils/GenerateProfilerData";

const Border = glamorous.div({
    border: "1px solid #000",
    width: "500px",
    height: "300px",
    margin: "0 auto",
});

type ProfilerItem = {
    from: number,
    to: number,
    name: string,
};

function handleCustomDrawItem(_context: CanvasRenderingContext2D, _item: ProfilerItem) {
    //context.strokeText(item.name, 5, 10);
}

storiesOf("ProfilerChartWithMinimap", module)
    .add("Default", () =>
        <Border>
            <ProfilerChartWithMinimap
                onCustomDrawItem={handleCustomDrawItem}
                from={0}
                to={10}
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
                        {
                            items: [{ from: 1, to: 1.5, name: "123" }, { from: 2, to: 2.9, name: "123" }],
                        },
                        {
                            items: [{ from: 1, to: 1.5, name: "123" }, { from: 2, to: 2.9, name: "123" }],
                        },
                    ],
                }}
            />
        </Border>
    )
    .add("FullScreen", () =>
        <ProfilerChartWithMinimap
            onCustomDrawItem={handleCustomDrawItem}
            from={0}
            to={10}
            data={{
                lines: [
                    {
                        items: [{ from: 0, to: 10, name: "123" }],
                    },
                    {
                        items: [{ from: 0, to: 2, name: "123" }, { from: 2.1, to: 3.993, name: "123" }],
                    },
                    {
                        items: [{ from: 0.5, to: 2, name: "123" }, { from: 2.6, to: 3.9, name: "123" }],
                    },
                    {
                        items: [{ from: 1, to: 1.5, name: "123" }, { from: 2, to: 2.9, name: "123" }],
                    },
                    {
                        items: [{ from: 1, to: 1.5, name: "123" }, { from: 2, to: 2.9, name: "123" }],
                    },
                    {
                        items: [{ from: 1, to: 1.5, name: "123" }, { from: 2, to: 2.9, name: "123" }],
                    },
                ],
            }}
        />
    )
    .add("FullScreen-LargeData", () =>
        <ProfilerChartWithMinimap
            onCustomDrawItem={handleCustomDrawItem}
            from={0}
            to={1000}
            data={{
                lines: generateProfilerData(0, 1000, 0, 7),
            }}
        />
    );
