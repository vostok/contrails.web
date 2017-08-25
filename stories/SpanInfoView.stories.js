// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";

import SpanInfoView from "../src/components/SpanInfoView/SpanInfoView";
import Response53ee602db8d444d9a7a674471be6b709 from "../src/Domain/Responses/53ee602db8d444d9a7a674471be6b709.json";

storiesOf("SpanInfoView", module).add("Default", () =>
    <SpanInfoView spanInfo={Response53ee602db8d444d9a7a674471be6b709[0].Spans[0]} />
);
