// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";

import TreeGrid from "../../src/components/TreeGrid/TreeGrid";

class TreeGridFocusMangement extends React.Component<{}, *> {
    state = {
        focusedItem: null,
        data: [
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
                        children: null,
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
        ],
    };

    render(): React.Node {
        const { focusedItem, data } = this.state;
        return (
            <TreeGrid
                focusedItem={focusedItem}
                onChangeFocusedItem={x => this.setState({ focusedItem: x })}
                onItemClick={x => this.setState({ focusedItem: x })}
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
                data={data}
            />
        );
    }
}

storiesOf("TreeGrid/FocusMangement", module).add("Default", () => <TreeGridFocusMangement />).add("Default2", () =>
    <div style={{ position: "relative", height: 100 }}>
        <TreeGridFocusMangement />
    </div>
);
