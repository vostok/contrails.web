import { storiesOf } from "@storybook/react";
import _ from "lodash";
import * as React from "react";

import { Button } from "../../src/Commons/ui";
import { TreeGrid, withExpandedItems } from "../../src/Components/TreeGrid/TreeGrid";

// tslint:disable-next-line no-inferred-empty-object-type Тут tslint тупит, всё нормально
const TreeGrid2 = withExpandedItems(TreeGrid);

interface Item {
    value1: string;
    value2: string;
    children: undefined | Item[];
}

class TreeGridFocusManagement extends React.Component<
    {},
    {
        focusedItem: undefined | Item;
        data: Item[];
    }
> {
    public state: {
        focusedItem: undefined | Item;
        data: Item[];
    } = {
        focusedItem: undefined,
        data: [
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
                        children: undefined,
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
        ],
    };

    public handleFocusNext(): void {
        const { focusedItem, data } = this.state;
        if (focusedItem == undefined) {
            this.setState({
                focusedItem: data[0],
            });
            return;
        }
        if (focusedItem.children != undefined) {
            this.setState({
                focusedItem: focusedItem.children[0],
            });
        }
    }

    public handleFocusInvisible(): void {
        const { data } = this.state;
        this.setState({
            focusedItem: data[2].children && data[2].children[1].children && data[2].children[1].children[700],
        });
    }

    public render(): JSX.Element {
        const { focusedItem, data } = this.state;
        return (
            <div style={{ position: "relative", height: "100%" }}>
                <div>
                    <Button onClick={() => this.handleFocusNext()}>Focus next</Button>
                    <Button onClick={() => this.handleFocusInvisible()}>Focus invisible</Button>
                </div>
                <div style={{ position: "relative", height: "90%" }}>
                    <TreeGrid2
                        filterNodes={() => true}
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

storiesOf("TreeGrid/FocusManagement", module)
    .add("Default", () => <TreeGridFocusManagement />)
    .add("Default2", () => (
        <div style={{ position: "relative", height: 100 }}>
            <TreeGridFocusManagement />
        </div>
    ));
