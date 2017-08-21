// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";

import TreeGrid from "../src/components/TreeGrid";

const item1 = {
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
};

storiesOf("TreeGrid", module).add("Default", () =>
    <TreeGrid
        columns={[
            {
                name: "Value 1",
                renderHeader: () => "Value 1",
                renderValue: x => x.value1,
            },
            {
                name: "Value 2",
                renderHeader: () => "Value 2",
                renderValue: x => x.value2,
            },
        ]}
        focusedItem={null}
        data={[
            item1,
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
                ],
            },
        ]}
    />
);
