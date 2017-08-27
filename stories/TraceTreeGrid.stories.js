// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";

import TraceTreeGrid from "../src/components/TraceTreeGrid/TraceTreeGrid";
import TraceTreeBuilder from "../src/Domain/TraceTree/TraceTreeBuilder";
import Response53ee602db8d444d9a7a674471be6b709 from "../src/Domain/Responses/53ee602db8d444d9a7a674471be6b709.json";

const data = new TraceTreeBuilder().buildTraceTree(Response53ee602db8d444d9a7a674471be6b709[0].Spans);

storiesOf("TraceTreeGrid", module)
    .add("Default", () => <TraceTreeGrid traceTree={data} />)
    .add("WithFocusedItem", () => <TraceTreeGrid focusedItem={data.children[0]} traceTree={data} />)
    .add("WithFocusedItem #2", () => <TraceTreeGrid focusedItem={data.children[0].children[1]} traceTree={data} />);
