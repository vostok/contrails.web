// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";

import TreeGrid from "../src/components/TreeGrid/TreeGrid";

const item1 = {
    value1: "value 1",
    value2: "value 1",
    children: [
        {
            value1: "value 1 2",
            value2: "value 1 2",
            children: null,
        },
        {
            value1: "value 1 2",
            value2: "value 1 2",
            children: null,
        },
    ],
};

storiesOf("TreeGrid", module).add("Default", () =>
    <TreeGrid
        onGetChildren={x => x.children}
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
        focusedItem={item1}
        data={[
            item1,
            {
                value1: "value 1",
                value2: "value 1",
                children: [
                    {
                        value1: "value 1 2",
                        value2: "value 1 2",
                        children: null,
                    },
                    {
                        value1: "value 1 2",
                        value2: "value 1 2",
                        children: [
                            {
                                value1: "value 1 2",
                                value2: "value 1 2",
                                children: null,
                            },
                            {
                                value1: "value 1 2",
                                value2: "value 1 2",
                                children: null,
                            },
                        ],
                    },
                ],
            },
        ]}
    />
);
