// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";

import ProfilerChartWithMinimap from "../../src/components/ProfilerChartWithMinimap/ProfilerChartWithMinimap";
import DefaultCustomDrawHandler from "../../src/components/ProfilerChart/DefaultCustomDrawHandler";
import generateProfilerData from "../Utils/GenerateProfilerData";
import BackgroundBorder from "../Utils/BackgroundBorder";

const defaultItemDrawer = new DefaultCustomDrawHandler();

storiesOf("ProfilerChartWithMinimap/SimpleData", module)
    .add("Default", () => (
        <BackgroundBorder width={500}>
            <ProfilerChartWithMinimap
                itemDrawer={defaultItemDrawer}
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
        </BackgroundBorder>
    ))
    .add("FullScreen", () => (
        <ProfilerChartWithMinimap
            itemDrawer={defaultItemDrawer}
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
    ))
    .add("FullScreenWithServer", () => (
        <ProfilerChartWithMinimap
            itemDrawer={defaultItemDrawer}
            from={0}
            to={10}
            data={{
                lines: [
                    {
                        items: [{ from: 0, to: 10, name: "123" }],
                    },
                    {
                        items: [
                            { from: 0, to: 2, name: "123" },
                            { from: 2.1, to: 3.993, serverRange: { from: 2.5, to: 3.5 }, name: "123" },
                        ],
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
    ))
    .add("FullScreen-ValuesForRealTime", () => (
        <ProfilerChartWithMinimap
            itemDrawer={defaultItemDrawer}
            from={1503233308736}
            to={1503233309325}
            data={{
                lines: [
                    {
                        items: [{ from: 1503233308736, to: 1503233309325, name: "123" }],
                    },
                ],
            }}
        />
    ))
    .add("FullScreen-LargeData", () => (
        <ProfilerChartWithMinimap
            itemDrawer={defaultItemDrawer}
            from={0}
            to={1000}
            data={{
                lines: generateProfilerData(0, 1000, 0, 7),
            }}
        />
    ))
    .add("FullScreen-Wide", () => (
        <ProfilerChartWithMinimap
            itemDrawer={defaultItemDrawer}
            from={0}
            to={1000}
            data={{
                lines: generateProfilerData(0, 1000, 0, 1),
            }}
        />
    ));
