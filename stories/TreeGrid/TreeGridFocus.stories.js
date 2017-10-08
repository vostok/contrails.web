// @flow
import * as React from "react";
import _ from "lodash";
import { Button } from "commons/ui";
import { storiesOf } from "@storybook/react";

import TreeGrid, { withExpandedItems } from "../../src/components/TreeGrid/TreeGrid";

const TreeGrid2 = withExpandedItems(TreeGrid);

type Item = {
    value1: string,
    value2: string,
    children: ?Array<Item>,
};

class TreeGridFocusMangement extends React.Component<{}, *> {
    state: {
        focusedItem: ?Item,
        data: Array<Item>,
    } = {
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
        ],
    };

    handleFocusNext() {
        const { focusedItem, data } = this.state;
        if (focusedItem == null) {
            this.setState({
                focusedItem: data[0],
            });
            return;
        }
        if (focusedItem.children != null) {
            this.setState({
                focusedItem: focusedItem.children[0],
            });
        }
    }

    handleFocusInvisible() {
        const { data } = this.state;
        this.setState({
            focusedItem: data[2].children && data[2].children[1].children && data[2].children[1].children[700],
        });
    }

    render(): React.Node {
        const { focusedItem, data } = this.state;
        return (
            <div style={{ position: "relative", height: "100%" }}>
                <div>
                    <Button onClick={() => this.handleFocusNext()}>Focus next</Button>
                    <Button onClick={() => this.handleFocusInvisible()}>Focus invisible</Button>
                </div>
                <div style={{ position: "relative", height: "90%" }}>
                    <TreeGrid2
                        focusedItem={focusedItem}
                        onChangeFocusedItem={x => this.setState({ focusedItem: x })}
                        onItemClick={x => this.setState({ focusedItem: x })}
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
                        data={data}
                    />
                </div>
            </div>
        );
    }
}

storiesOf("TreeGrid/FocusMangement", module).add("Default", () => <TreeGridFocusMangement />).add("Default2", () =>
    <div style={{ position: "relative", height: 100 }}>
        <TreeGridFocusMangement />
    </div>
);
