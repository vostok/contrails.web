import { storiesOf } from "@storybook/react";
import * as React from "react";

import { SpanInfoView } from "../src/Components/SpanInfoView/SpanInfoView";
import { VostokDataExtractor } from "../src/Domain/IDataExtractor";
import Response1 from "../src/Domain/Responses/a7f26865-a1d4-4064-b565-84df9b2e780f.json";
import { TraceTreeBuilder } from "../src/Domain/TraceTree/TraceTreeBuilder";

const data1 = new TraceTreeBuilder(new VostokDataExtractor()).buildTraceTree(Response1);

storiesOf("SpanInfoView", module).add("Default", () => <SpanInfoView root={data1} span={data1.children[0]} />);
