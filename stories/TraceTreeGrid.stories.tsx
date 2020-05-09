// import { action } from "@storybook/addon-actions";
// import { storiesOf } from "@storybook/react";
// import * as React from "react";
//
// import { TraceTreeGrid } from "../src/Components/TraceTreeGrid/TraceTreeGrid";
// import { VostokDataExtractor } from "../src/Domain/IDataExtractor";
// import Response1 from "../src/Domain/Responses/1885c01e-6a20-4b17-85ca-84bd0518a65c.json";
// import Response2 from "../src/Domain/Responses/a7f26865-a1d4-4064-b565-84df9b2e780f.json";
// import { TraceInfoUtils } from "../src/Domain/TraceInfo";
// import { TraceTreeBuilder } from "../src/Domain/TraceTree/TraceTreeBuilder";
//
// const data1 = new TraceTreeBuilder(new VostokDataExtractor()).buildTraceTree(Response1);
// const data2 = new TraceTreeBuilder(new VostokDataExtractor()).buildTraceTree(Response2);
//
// storiesOf("TraceTreeGrid", module)
//     .add("Default", () => (
//         <TraceTreeGrid
//             totalTimeRange={TraceInfoUtils.getTraceTimeRange(Response1)}
//             traceTree={data1}
//             onChangeFocusedItem={action("onChangeFocusedItem")}
//         />
//     ))
//     .add("WithFocusedItem", () => (
//         <TraceTreeGrid
//             totalTimeRange={TraceInfoUtils.getTraceTimeRange(Response1)}
//             focusedItem={data1.children[0]}
//             traceTree={data1}
//             onChangeFocusedItem={action("onChangeFocusedItem")}
//         />
//     ))
//     .add("WithFocusedItem #1", () => (
//         <TraceTreeGrid
//             totalTimeRange={TraceInfoUtils.getTraceTimeRange(Response1)}
//             focusedItem={data1.children[0].children[1]}
//             traceTree={data1}
//             onChangeFocusedItem={action("onChangeFocusedItem")}
//         />
//     ))
//     .add("WithFocusedItem #2", () => (
//         <TraceTreeGrid
//             totalTimeRange={TraceInfoUtils.getTraceTimeRange(Response2)}
//             focusedItem={data2.children[0].children[1]}
//             traceTree={data2}
//             onChangeFocusedItem={action("onChangeFocusedItem")}
//         />
//     ));
