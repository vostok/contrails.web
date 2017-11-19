// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";

import ProfilerChartWithMinimap from "../../src/components/ProfilerChartWithMinimap/ProfilerChartWithMinimap";
import Response62f8278dab21471c8370fa47d4f52f72 from "../../src/Domain/Responses/62f8278dab21471c8370fa47d4f52f72.json";
import Response37fa1a7edcc34ca28204fc50e6681e70 from "../../src/Domain/Responses/37fa1a7edcc34ca28204fc50e6681e70.json";
import CustomItemDrawer from "../../src/Domain/CustomItemDrawer/CustomItemDrawer";

import { buildPropsFromResponse } from "./ProfilerChartDataUtils";

const itemDrawer = new CustomItemDrawer();

storiesOf("ProfilerChartWithMinimap/LogsearchResponses", module)
    .add("FullScreen-DataFromTrace-62f8278dab21471c8370fa47d4f52f72", () => (
        <ProfilerChartWithMinimap
            itemDrawer={itemDrawer}
            {...buildPropsFromResponse(Response62f8278dab21471c8370fa47d4f52f72)}
        />
    ))
    .add("FullScreen-DataFromTrace-37fa1a7edcc34ca28204fc50e6681e70", () => (
        <ProfilerChartWithMinimap
            itemDrawer={itemDrawer}
            {...buildPropsFromResponse(Response37fa1a7edcc34ca28204fc50e6681e70)}
        />
    ))
    .add("FullScreen-ServerData-StrangeCase", () => (
        <ProfilerChartWithMinimap
            itemDrawer={itemDrawer}
            {...buildPropsFromResponse([
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
