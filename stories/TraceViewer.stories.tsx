import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import { TraceViewer } from "../src/Components/TraceViewer/TraceViewer";
import { IDataExtractor, VostokDataExtractor } from "../src/Domain/IDataExtractor";
import Response53ee602db8d444d9a7a674471be6b709 from "../src/Domain/Responses/a7f26865-a1d4-4064-b565-84df9b2e780f.json";
import { TraceInfo } from "../src/Domain/TraceInfo";
import { vostokResponseToTraceInfo } from "../src/Domain/VostokResponseToTraceInfo";
import { ActionType } from "../src/Store/ContrailsApplicationActions";
import { createContrailsApplicationReducer } from "../src/Store/ContrailsApplicationReducer";

interface TraceViewerStoryProps {
    dataExtractor: IDataExtractor;
    traceInfo: TraceInfo;
}

function TraceViewerStory({ dataExtractor, traceInfo }: TraceViewerStoryProps): JSX.Element {
    const [store] = React.useState(() => {
        const result = createStore(createContrailsApplicationReducer(dataExtractor), applyMiddleware(thunk));
        result.dispatch({ type: ActionType.UpdateTrace, payload: { traceInfo: traceInfo } });
        return result;
    });
    return (
        <Provider store={store}>
            <TraceViewer
                traceIdPrefix={traceInfo.TraceId}
                traceInfo={store.getState().traceInfo}
                onLoadTrace={async () => {
                    action("onLoadTrace")();
                }}
                onChangeSubtree={action("onChangeSubtree")}
                onOpenTrace={action("onOpenTrace")}
            />
        </Provider>
    );
}

storiesOf("TraceViewer", module)
    .add("SingleSpan", () => (
        <TraceViewerStory
            dataExtractor={new VostokDataExtractor()}
            traceInfo={{
                TraceId: "1",
                Spans: [
                    {
                        TraceId: "1",
                        SpanId: "1",
                        ParentSpanId: undefined,
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
        <TraceViewerStory
            dataExtractor={new VostokDataExtractor()}
            traceInfo={{
                TraceId: "1",
                Spans: [
                    {
                        TraceId: "1",
                        SpanId: "1",
                        ParentSpanId: undefined,
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
        <TraceViewerStory
            dataExtractor={new VostokDataExtractor()}
            traceInfo={{
                TraceId: "1",
                Spans: [
                    {
                        TraceId: "1",
                        SpanId: "1",
                        ParentSpanId: undefined,
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
        <TraceViewerStory
            dataExtractor={new VostokDataExtractor()}
            traceInfo={{
                TraceId: "1",
                Spans: [
                    {
                        TraceId: "1",
                        SpanId: "1",
                        ParentSpanId: undefined,
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
        <TraceViewerStory
            dataExtractor={new VostokDataExtractor()}
            traceInfo={{
                TraceId: "1",
                Spans: [
                    {
                        BeginTimestamp: "2017-10-28T14:30:21.25+00:00",
                        EndTimestamp: "2017-10-28T14:30:21.26+00:00",
                        ParentSpanId: undefined,
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
        <TraceViewerStory
            dataExtractor={new VostokDataExtractor()}
            traceInfo={vostokResponseToTraceInfo(Response53ee602db8d444d9a7a674471be6b709)}
        />
    ));
