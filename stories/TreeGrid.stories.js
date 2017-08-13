// @flow
import React from "react";
import { storiesOf } from "@storybook/react";

import TreeGrid from "../src/components/TreeGrid";

storiesOf("TreeGrid", module).add("Default", () =>
    <TreeGrid
        data={[
            {
                value1: "value 1",
                value2: "value 1",
                children: [
                    {
                        value1: "value 1 2",
                        value2: "value 1 2",
                    },
                    {
                        value1: "value 1 2",
                        value2: "value 1 2",
                    },
                ],
            },
            {
                value1: "value 1",
                value2: "value 1",
                children: [
                    {
                        value1: "value 1 2",
                        value2: "value 1 2",
                    },
                    {
                        value1: "value 1 2",
                        value2: "value 1 2",
                    },
                ],
            },
        ]}
    />
);
