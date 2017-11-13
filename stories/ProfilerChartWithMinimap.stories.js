// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import moment from "moment";

import ProfilerChartWithMinimap from "../src/components/ProfilerChartWithMinimap/ProfilerChartWithMinimap";
import type { TraceInfo } from "../src/Domain/TraceInfo";
import Response62f8278dab21471c8370fa47d4f52f72 from "../src/Domain/Responses/62f8278dab21471c8370fa47d4f52f72.json";
import Response37fa1a7edcc34ca28204fc50e6681e70 from "../src/Domain/Responses/37fa1a7edcc34ca28204fc50e6681e70.json";
import TraceTreeBuilder from "../src/Domain/TraceTree/TraceTreeBuilder";
import SpansToLinesArranger from "../src/Domain/SpanLines/SpansToLinesArranger";
import type { SpanLines } from "../src/Domain/SpanLines/SpansToLinesArranger";
import handleCustomDrawItem from "../src/Domain/ItemDrawer";
import { LogsearchDataExtractor } from "../src/Domain/IDataExtractor";

import generateProfilerData from "./Utils/GenerateProfilerData";

function Border({ children }: { children: React.Node }): React.Node {
    return (
        <div
            style={{
                border: "1px solid #000",
                width: "500px",
                height: "300px",
                margin: "0 auto",
            }}>
            {children}
        </div>
    );
}

function min(x: number, y: number): number {
    return Math.min(x, y);
}

function max(x: number, y: number): number {
    return Math.max(x, y);
}

function getFromAndTo(response: TraceInfo[]): { from: number, to: number } {
    const spans = response[0].Spans;
    const result = {
        from: spans
            .map(x => x.BeginTimestamp)
            .map(x => moment(x))
            .map(x => x.valueOf())
            .reduce(min),
        to: spans
            .map(x => x.EndTimestamp)
            .map(x => moment(x))
            .map(x => x.valueOf())
            .reduce(max),
    };
    return result;
}

function generateDataFromDiTraceResponse(response: TraceInfo[]): { lines: SpanLines } {
    const arranger = new SpansToLinesArranger();
    const spans = response[0].Spans;
    return { lines: arranger.arrange(new TraceTreeBuilder(new LogsearchDataExtractor()).buildTraceTree(spans)) };
}

storiesOf("ProfilerChartWithMinimap", module)
    .add("Default", () => (
        <Border>
            <ProfilerChartWithMinimap
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
    ))
    .add("FullScreen", () => (
        <ProfilerChartWithMinimap
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
    .add("FullScreen-LargeData", () => (
        <ProfilerChartWithMinimap
            from={0}
            to={1000}
            data={{
                lines: generateProfilerData(0, 1000, 0, 7),
            }}
        />
    ))
    .add("FullScreen-ValuesForRealTime", () => (
        <ProfilerChartWithMinimap
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
    .add("FullScreen-DataFromTrace-62f8278dab21471c8370fa47d4f52f72", () => (
        <ProfilerChartWithMinimap
            onCustomDrawItem={handleCustomDrawItem}
            {...getFromAndTo(Response62f8278dab21471c8370fa47d4f52f72)}
            data={generateDataFromDiTraceResponse(Response62f8278dab21471c8370fa47d4f52f72)}
        />
    ))
    .add("FullScreen-DataFromTrace-37fa1a7edcc34ca28204fc50e6681e70", () => (
        <ProfilerChartWithMinimap
            onCustomDrawItem={handleCustomDrawItem}
            {...getFromAndTo(Response37fa1a7edcc34ca28204fc50e6681e70)}
            data={generateDataFromDiTraceResponse(Response37fa1a7edcc34ca28204fc50e6681e70)}
        />
    ));
