// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";

import TraceTreeGrid from "../src/components/TraceTreeGrid/TraceTreeGrid";
import TraceTreeBuilder from "../src/Domain/TraceTree/TraceTreeBuilder";
import Response53ee602db8d444d9a7a674471be6b709 from "../src/Domain/Responses/53ee602db8d444d9a7a674471be6b709.json";
import Responseaae265d9c1fa4c2c9d504c798ee9854a from "../src/Domain/Responses/aae265d9c1fa4c2c9d504c798ee9854a.json";

const data1 = new TraceTreeBuilder().buildTraceTree(Response53ee602db8d444d9a7a674471be6b709[0].Spans);
const data2 = new TraceTreeBuilder().buildTraceTree(Responseaae265d9c1fa4c2c9d504c798ee9854a[0].Spans);

storiesOf("TraceTreeGrid", module)
    .add("Default", () => <TraceTreeGrid traceTree={data1} />)
    .add("WithFocusedItem", () => <TraceTreeGrid focusedItem={data1.children[0]} traceTree={data1} />)
    .add("WithFocusedItem #1", () => <TraceTreeGrid focusedItem={data1.children[0].children[1]} traceTree={data1} />)
    .add("WithFocusedItem #2", () => <TraceTreeGrid focusedItem={data2.children[0].children[1]} traceTree={data2} />);
