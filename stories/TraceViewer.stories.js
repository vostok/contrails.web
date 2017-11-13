// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { createStore } from "redux";
import { Provider } from "react-redux";

import { LogsearchDataExtractor, VostokDataExtractor } from "../src/Domain/IDataExtractor";
import TraceViewer from "../src/components/TraceViewer/TraceViewer";
import Response53ee602db8d444d9a7a674471be6b709 from "../src/Domain/Responses/53ee602db8d444d9a7a674471be6b709.json";
import contrailsApplicationReducer from "../src/reducer/contrailsApplicationReducer";

const store = createStore(contrailsApplicationReducer);

storiesOf("TraceViewer", module)
    .addDecorator(story => <Provider store={store}>{story()}</Provider>)
    .add("SingleSpan", () => (
        <TraceViewer
            dataExtractor={new LogsearchDataExtractor()}
            traceInfo={{
                TraceId: "1",
                Spans: [
                    {
                        TraceId: "1",
                        SpanId: "1",
                        ParentSpanId: null,
                        OperationName: "HTTP",
                        BeginTimestamp: "2017-01-01T01:00:00.0000000+03:00",
                        EndTimestamp: "2017-01-01T01:01:00.0000000+03:00",
                        Annotations: {
                            OriginHost: "Host",
                            OriginId: "Id",
                        },
                    },
                ],
            }}
        />
    ))
    .add("LostSpan #1", () => (
        <TraceViewer
            dataExtractor={new LogsearchDataExtractor()}
            traceInfo={{
                TraceId: "1",
                Spans: [
                    {
                        TraceId: "1",
                        SpanId: "1",
                        ParentSpanId: null,
                        OperationName: "HTTP",
                        BeginTimestamp: "2017-01-01T01:00:00.0000000+03:00",
                        EndTimestamp: "2017-01-01T01:01:00.0000000+03:00",
                        Annotations: {
                            OriginHost: "Host",
                            OriginId: "Id",
                        },
                    },
                    {
                        TraceId: "1",
                        SpanId: "3",
                        ParentSpanId: "2",
                        OperationName: "HTTP",
                        BeginTimestamp: "2017-01-01T01:00:00.0000000+03:00",
                        EndTimestamp: "2017-01-01T01:01:00.0000000+03:00",
                        Annotations: {
                            OriginHost: "Host",
                            OriginId: "Id",
                        },
                    },
                ],
            }}
        />
    ))
    .add("LostSpan #2", () => (
        <TraceViewer
            dataExtractor={new LogsearchDataExtractor()}
            traceInfo={{
                TraceId: "1",
                Spans: [
                    {
                        TraceId: "1",
                        SpanId: "1",
                        ParentSpanId: null,
                        OperationName: "HTTP",
                        BeginTimestamp: "2017-01-01T01:00:00.0000000+03:00",
                        EndTimestamp: "2017-01-01T01:04:00.0000000+03:00",
                        Annotations: {
                            OriginHost: "Host",
                            OriginId: "Id",
                        },
                    },
                    {
                        TraceId: "1",
                        SpanId: "2",
                        ParentSpanId: "1",
                        OperationName: "HTTP",
                        BeginTimestamp: "2017-01-01T01:01:00.0000000+03:00",
                        EndTimestamp: "2017-01-01T01:03:00.0000000+03:00",
                        Annotations: {
                            OriginHost: "Host",
                            OriginId: "Id",
                        },
                    },
                    {
                        TraceId: "1",
                        SpanId: "4",
                        ParentSpanId: "3",
                        OperationName: "HTTP",
                        BeginTimestamp: "2017-01-01T01:02:00.0000000+03:00",
                        EndTimestamp: "2017-01-01T01:03:00.0000000+03:00",
                        Annotations: {
                            OriginHost: "Host",
                            OriginId: "Id",
                        },
                    },
                ],
            }}
        />
    ))
    .add("LostSpan #3", () => (
        <TraceViewer
            dataExtractor={new LogsearchDataExtractor()}
            traceInfo={{
                TraceId: "1",
                Spans: [
                    {
                        TraceId: "1",
                        SpanId: "1",
                        ParentSpanId: null,
                        OperationName: "HTTP",
                        BeginTimestamp: "2017-01-01T01:00:00.0000000+03:00",
                        EndTimestamp: "2017-01-01T01:10:00.0000000+03:00",
                        Annotations: {
                            OriginHost: "Host",
                            OriginId: "Id",
                        },
                    },
                    {
                        TraceId: "1",
                        SpanId: "2",
                        ParentSpanId: "1",
                        OperationName: "HTTP",
                        BeginTimestamp: "2017-01-01T01:01:00.0000000+03:00",
                        EndTimestamp: "2017-01-01T01:03:00.0000000+03:00",
                        Annotations: {
                            OriginHost: "Host",
                            OriginId: "Id",
                        },
                    },
                    {
                        TraceId: "1",
                        SpanId: "4",
                        ParentSpanId: "3",
                        OperationName: "HTTP",
                        BeginTimestamp: "2017-01-01T01:04:00.0000000+03:00",
                        EndTimestamp: "2017-01-01T01:05:00.0000000+03:00",
                        Annotations: {
                            OriginHost: "Host",
                            OriginId: "Id",
                        },
                    },
                ],
            }}
        />
    ))
    .add("Vostok LostSpan", () => (
        <TraceViewer
            dataExtractor={new VostokDataExtractor()}
            traceInfo={{
                TraceId: "1",
                Spans: [
                    {
                        BeginTimestamp: "2017-10-28T14:30:21.25+00:00",
                        EndTimestamp: "2017-10-28T14:30:21.26+00:00",
                        ParentSpanId: null,
                        SpanId: "9ffa6d1c4b2342a99c511236d8b22019",
                        TraceId: "da9fdf340cba42f280837dea88780786",
                        Annotations: {
                            operation: "Generate Trace",
                            kind: "loadtest",
                            service: "event-generator",
                            host: "localhost",
                            "http.url": "send",
                            "http.requestContentLength": "1024",
                            "http.responseContentLength": "2048",
                            "http.code": "200",
                        },
                    },
                ],
            }}
        />
    ))
    .add("Default", () => (
        <TraceViewer
            dataExtractor={new LogsearchDataExtractor()}
            traceInfo={Response53ee602db8d444d9a7a674471be6b709[0]}
        />
    ));
