import Button from "@skbkontur/react-ui/Button";
import { storiesOf } from "@storybook/react";
import _ from "lodash";
import * as React from "react";

import { VirtualTable } from "../src/Components/VirtualTable/VirtualTable";

interface VirtualTableContainerState {
    intoViewIndex: number;
    items: Array<{ value: string }>;
}

class VirtualTableContainer extends React.Component<{}, VirtualTableContainerState> {
    public table = React.createRef<VirtualTable<{ value: string }>>();

    public constructor(props: {}) {
        super(props);
        this.state = {
            intoViewIndex: 0,
            items: _.range(1000).map(x => ({ value: `value${x}` })),
        };
    }

    public render(): JSX.Element {
        const { items } = this.state;
        const { intoViewIndex } = this.state;

        return (
            <div style={{ position: "relative", height: "100%" }}>
                <div>
                    <Button
                        onClick={() => {
                            if (this.table.current != undefined) {
                                this.table.current.scrollIntoView(items[500]);
                            }
                            this.setState({
                                intoViewIndex: 500,
                            });
                        }}>
                        Scroll into view
                    </Button>
                    <Button
                        onClick={() => {
                            this.setState({
                                intoViewIndex: intoViewIndex - 1,
                            });
                            if (this.table.current != undefined) {
                                this.table.current.scrollIntoView(items[intoViewIndex - 1]);
                            }
                        }}>
                        Scroll into view up
                    </Button>
                    <Button
                        onClick={() => {
                            this.setState({
                                intoViewIndex: intoViewIndex + 1,
                            });
                            if (this.table.current != undefined) {
                                this.table.current.scrollIntoView(items[intoViewIndex + 1]);
                            }
                        }}>
                        Scroll into view down
                    </Button>
                    {intoViewIndex}
                </div>
                <div style={{ position: "absolute", top: 40, bottom: 0, left: 0, right: 0 }}>
                    <VirtualTable
                        ref={this.table}
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
