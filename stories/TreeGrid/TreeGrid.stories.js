// @flow
import * as React from "react";
import _ from "lodash";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import TreeGrid, { withExpandedItems } from "../../src/components/TreeGrid/TreeGrid";

const TreeGrid2 = withExpandedItems(TreeGrid);

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

storiesOf("TreeGrid/Default", module)
    .add("Default", () => (
        <TreeGrid2
            filterNodes={() => true}
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
                    mainCell: true,
                },
            ]}
            onChangeFocusedItem={action("onChangeFocusedItem")}
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
    ))
    .add("Many children", () => (
        <TreeGrid2
            filterNodes={() => true}
            onChangeFocusedItem={action("onChangeFocusedItem")}
            onGetChildren={x => x.children}
            columns={[
                {
                    width: 100,
                    name: "Value 1",
                    renderHeader: () => "Value 1",
                    renderValue: x => x.value1,
                },
                {
                    name: "Value 2",
                    renderHeader: () => "Value 2",
                    renderValue: x => x.value2,
                    mainCell: true,
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
                            children: _.range(1000).map(x => ({
                                value1: `value 1 ${x}`,
                                value2: `value 1 ${x}`,
                                children: null,
                            })),
                        },
                    ],
                },
            ]}
        />
    ));
