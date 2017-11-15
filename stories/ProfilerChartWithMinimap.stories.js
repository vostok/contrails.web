// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import moment from "moment";

import ProfilerChartWithMinimap from "../src/components/ProfilerChartWithMinimap/ProfilerChartWithMinimap";
import type { TraceInfo } from "../src/Domain/TraceInfo";
import type { SpanInfo } from "../src/Domain/SpanInfo";
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

function timestamp(relativeValue: number): string {
    return moment("2013-02-08 12:00:00.000")
        .add(relativeValue, "seconds")
        .format();
}

function timestampAsNumber(relativeValue: number): number {
    return moment("2013-02-08 12:00:00.000")
        .add(relativeValue, "seconds")
        .valueOf();
}
// eslint-disable-next-line max-params
function createSpan(id: string, parentId: ?string, from: number, to: number, isClientSpan: boolean): SpanInfo {
    return {
        BeginTimestamp: timestamp(from),
        EndTimestamp: timestamp(to),
        TraceId: "1",
        SpanId: id,
        ParentSpanId: parentId,
        OperationName: "Name",
        Annotations: {
            IsClientSpan: isClientSpan,
        },
    };
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
    .add("FullScreenWithServer", () => (
        <ProfilerChartWithMinimap
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
    ))
    .add("FullScreen-ServerData", () => (
        <ProfilerChartWithMinimap
            onCustomDrawItem={handleCustomDrawItem}
            from={timestampAsNumber(1)}
            to={timestampAsNumber(4)}
            data={generateDataFromDiTraceResponse([
                {
                    TraceId: "1",
                    Spans: [createSpan("1", null, 1, 4, true), createSpan("2", "1", 2, 4, false)],
                },
            ])}
        />
    ))
    .add("FullScreen-ServerData-WithTimeShift", () => (
        <ProfilerChartWithMinimap
            onCustomDrawItem={handleCustomDrawItem}
            from={timestampAsNumber(1)}
            to={timestampAsNumber(4)}
            data={generateDataFromDiTraceResponse([
                {
                    TraceId: "1",
                    Spans: [createSpan("1", null, 1, 3, true), createSpan("2", "1", 2, 4, false)],
                },
            ])}
        />
    ))

    .add("FullScreen-ServerData-StrangeCase", () => (
        <ProfilerChartWithMinimap
            onCustomDrawItem={handleCustomDrawItem}
            from={moment("2017-10-23T10:33:19.0280000Z").valueOf()}
            to={moment("2017-10-23T10:33:28.6311722Z").valueOf()}
            data={generateDataFromDiTraceResponse([
                {
                    TraceId: "1",
                    Spans: [
                        {
                            TraceId: "d3e73de0be3b4a3abdcc823406bb35fd",
                            SpanId: "56ce1aa2000000000000000000000000",
                            ParentSpanId: null,
                            OperationName: "HTTP",
                            BeginTimestamp: "2017-10-23T13:33:19.8190000+03:00",
                            EndTimestamp: "2017-10-23T13:33:20.3389051+03:00",
                            Annotations: { OriginHost: "vm-abon9", OriginId: "Abonents", IsClientSpan: false },
                        },
                        {
                            TraceId: "d3e73de0be3b4a3abdcc823406bb35fd",
                            SpanId: "ba07e4460000000000000000000000001",
                            ParentSpanId: "56ce1aa2000000000000000000000000",
                            OperationName: "HTTP",
                            BeginTimestamp: "2017-10-23T13:33:19.8340000+03:00",
                            EndTimestamp: "2017-10-23T13:33:19.8391061+03:00",
                            Annotations: {
                                OriginHost: "vm-abon9",
                                OriginId: "Abonents",
                                IsClientSpan: true,
                                ClientRequestMethod: "GET",
                                ClientTargetHost: "vm-portalreqs4",
                                ClientRequestBodySize: 0,
                                ClientRequestUrlHash: 740385009,
                                ClientResponseCode: 200,
                                ClientTargetPort: 29816,
                                ClientResponseBodySize: 32,
                            },
                        },
                        {
                            TraceId: "d3e73de0be3b4a3abdcc823406bb35fd",
                            SpanId: "ba07e446000000000000000000000000",
                            ParentSpanId: "ba07e4460000000000000000000000001",
                            //ParentSpanId: "56ce1aa2000000000000000000000000",
                            OperationName: "HTTP",
                            BeginTimestamp: "2017-10-23T13:33:19.8040000+03:00",
                            EndTimestamp: "2017-10-23T13:33:19.8079751+03:00",
                            Annotations: {
                                OriginHost: "vm-portalreqs4",
                                OriginId: "Portal.Requisites.Service",
                                IsClientSpan: false,
                            },
                        },
                    ],
                },
            ])}
        />
    ));
