// @flow
import * as React from "react";
import { Button } from "commons/ui";
import _ from "lodash";
import { storiesOf } from "@storybook/react";

import VirtualTable from "../src/components/VirtualTable/VirtualTable";

class VirtualTableContainer extends React.Component<{}, *> {
    props: {};
    table: ?VirtualTable<*>;

    constructor(props: {}) {
        super(props);
        this.state = {
            intoViewIndex: 0,
            items: _.range(1000).map(x => ({ value: `value${x}` })),
        };
    }

    render(): React.Node {
        const { items } = this.state;
        const { intoViewIndex } = this.state;

        return (
            <div style={{ position: "relative", height: "100%" }}>
                <div>
                    <Button
                        onClick={() => {
                            if (this.table != null) this.table.scrollIntoView(items[500]);
                            this.setState({
                                intoViewIndex: 500,
                            });
                        }}>
                        Scroll into view
                    </Button>
                    <Button
                        onClick={() => {
                            const { intoViewIndex } = this.state;
                            this.setState({
                                intoViewIndex: intoViewIndex - 1,
                            });
                            if (this.table != null) this.table.scrollIntoView(items[intoViewIndex - 1]);
                        }}>
                        Scroll into view up
                    </Button>
                    <Button
                        onClick={() => {
                            const { intoViewIndex } = this.state;
                            this.setState({
                                intoViewIndex: intoViewIndex + 1,
                            });
                            if (this.table != null) this.table.scrollIntoView(items[intoViewIndex + 1]);
                        }}>
                        Scroll into view down
                    </Button>
                    {intoViewIndex}
                </div>
                <div style={{ position: "absolute", top: 40, bottom: 0, left: 0, right: 0 }}>
                    <VirtualTable
                        ref={e => (this.table = e)}
                        rowHeight={20}
                        headerHeight={20}
                        data={items}
                        renderHeader={() => (
                            <tr>
                                <th>Value</th>
                            </tr>
                        )}
                        renderRow={x => (
                            <tr key={x.value}>
                                <td style={{ height: 20 }}>{x.value}</td>
                            </tr>
                        )}
                    />
                </div>
            </div>
        );
    }
}

storiesOf("VirtualTable", module).add("Default", () => <VirtualTableContainer />);
