import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Colors as itemColors } from "../../src/Domain/Colors";

function Line({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <div
            style={{
                height: 10,
            }}>
            {children}
        </div>
    );
}

function Item({
    children,
    colorIndex,
    style,
    width,
}: {
    children?: React.ReactNode;
    width: number;
    colorIndex: number;
    style?: {};
}): JSX.Element {
    return (
        <div
            style={{
                border: `1px solid ${itemColors[colorIndex].border}`,
                position: "relative",
                display: "inline-block",
                marginTop: 1,
                padding: "3px 7px",
                boxSizing: "border-box",
                backgroundColor: itemColors[colorIndex].background,
                color: itemColors[colorIndex].text,
                height: 10,
                overflow: "hidden",
                textOverflow: "ellipsis",
                zIndex: 1,
                width: width,
                ...style,
            }}>
            {children}
        </div>
    );
}

storiesOf("Prototypes/MinimapChartItemPrototype", module).add("Default", () => (
    <div
        style={{
            padding: 20,
        }}>
        <Line>
            <Item width={300} colorIndex={0} />
        </Line>
        <Line>
            <Item width={200} colorIndex={1} />
        </Line>
        <Line>
            <Item width={200} colorIndex={2} />
        </Line>
        <Line>
            <Item width={200} colorIndex={4} />
            <Item width={200} colorIndex={4} style={{ marginLeft: -80 }} />
        </Line>
        <Line>
            <Item width={200} colorIndex={4} />
            <Item width={200} colorIndex={4} style={{ marginLeft: -10 }} />
        </Line>
        <Line>
            <Item width={300} colorIndex={4} />
            <Item width={100} colorIndex={4} style={{ marginLeft: -300 }} />
        </Line>
    </div>
));
