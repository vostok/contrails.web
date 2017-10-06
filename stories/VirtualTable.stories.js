// @flow
import * as React from "react";
import _ from "lodash";
import { storiesOf } from "@storybook/react";

import VirtualTable from "../src/components/VirtualTable/VirtualTable";

storiesOf("VirtualTable", module).add("Default", () =>
    <VirtualTable
        rowHeight={20}
        data={_.range(100).map(x => ({ value: `value${x}` }))}
        renderHeader={() => <tr><th>Value</th></tr>}
        renderRow={x =>
            <tr>
                <td key={x.value} style={{ height: 20 }}>
                    {x.value}
                </td>
            </tr>}
    />
);
