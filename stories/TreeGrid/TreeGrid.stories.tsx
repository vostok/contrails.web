import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import _ from "lodash";
import * as React from "react";

import { TreeGrid, TreeGridProps } from "../../src/Components/TreeGrid/TreeGrid";

function TreeGrid2(props: Omit<TreeGridProps<Item>, "onChangeExpandedItems" | "expandedItems">): JSX.Element {
    const [expandedItems, setExpandedItems] = React.useState<Item[]>([]);
    return <TreeGrid {...props} onChangeExpandedItems={setExpandedItems} expandedItems={expandedItems} />;
}

interface Item {
    value1: string;
    value2: string;
    children: undefined | Item[];
}

const item1: Item = {
    value1: "value 1",
    value2: "value 1",
    children: [
        {
            value1: "value 1 2",
            value2: "value 1 2",
            children: undefined,
        },
        {
            value1: "value 1 2",
            value2: "value 1 2",
            children: undefined,
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
                            children: undefined,
                        },
                        {
                            value1: "value 1 2",
                            value2: "value 1 2",
                            children: [
                                {
                                    value1: "value 1 2",
                                    value2: "value 1 2",
                                    children: undefined,
                                },
                                {
                                    value1: "value 1 2",
                                    value2: "value 1 2",
                                    children: undefined,
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
                            children: undefined,
                        },
                        {
                            value1: "value 1 2",
                            value2: "value 1 2",
                            children: _.range(1000).map(x => ({
                                value1: `value 1 ${x}`,
                                value2: `value 1 ${x}`,
                                children: undefined,
                            })),
                        },
                    ],
                },
            ]}
        />
    ));
