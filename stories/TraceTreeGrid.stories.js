// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";

import TraceTreeGrid from "../src/components/TraceTreeGrid";
import TraceTreeBuilder from "../src/Domain/TraceTree/TraceTreeBuilder";
import Response53ee602db8d444d9a7a674471be6b709 from "../src/Domain/Responses/53ee602db8d444d9a7a674471be6b709.json";

storiesOf("TraceTreeGrid", module).add("Default", () =>
    <TraceTreeGrid
        traceTree={new TraceTreeBuilder().buildTraceTree(Response53ee602db8d444d9a7a674471be6b709[0].Spans)}
    />
);