// // @flow
// import * as React from "react";
// import { storiesOf } from "@storybook/react";

// import SpanInfoView from "../src/components/SpanInfoView/SpanInfoView";
// import TraceTreeBuilder from "../src/Domain/TraceTree/TraceTreeBuilder";
// import Response53ee602db8d444d9a7a674471be6b709 from "../src/Domain/Responses/53ee602db8d444d9a7a674471be6b709.json";
// import { LogsearchDataExtractor } from "../src/Domain/IDataExtractor";

// const data1 = new TraceTreeBuilder(new LogsearchDataExtractor()).buildTraceTree(
//     Response53ee602db8d444d9a7a674471be6b709[0].Spans
// );

// storiesOf("SpanInfoView", module).add("Default", () => <SpanInfoView root={data1} span={data1.children[0]} />);
