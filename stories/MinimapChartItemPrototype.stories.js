// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import glamorous from "glamorous";

import ServiceIcon from "../src/components/Icons/service.svg";
import CassandraIcon from "../src/components/Icons/cassandra.svg";
import DatabaseIcon from "../src/components/Icons/db.svg";

import { Icon } from "ui";

const itemColors = [
    {
        text: "white",
        background: "rgba(30, 121, 190, 0.50)",
        hoverText: "white",
        hoverBackground: "rgba(30, 121, 190, 0.80)",
        border: "rgba(30, 121, 190, 1.0)",
    },
    {
        text: "white",
        background: "rgba(215, 12, 23, 0.50)",
        hoverText: "white",
        hoverBackground: "rgba(215, 12, 23, 0.80)",
        border: "rgba(215, 12, 23, 1.0)",
    },
    {
        text: "white",
        background: "rgba(255,85,0,0.50)",
        hoverText: "white",
        hoverBackground: "rgba(255,85,0,0.80)",
        border: "rgba(255,85,0,1.0)",
    },
    {
        text: "white",
        background: "rgba(0,170,144,0.50)",
        hoverText: "white",
        hoverBackground: "rgba(0,170,144,0.80)",
        border: "rgba(0,170,144,1.0)",
    },
    {
        text: "white",
        background: "rgba(162,58,153,0.50)",
        hoverText: "white",
        hoverBackground: "rgba(162,58,153,0.80)",
        border: "rgba(162,58,153,1.0)",
    },
];

const Line = glamorous.div({
    height: 10,
});

const Item = glamorous.div(({ width, colorIndex }) => ({
    border: `1px solid ${itemColors[colorIndex].border}`,
    position: "relative",
    display: "inline-block",
    marginTop: 1,
    padding: "3px 7px",
    boxSizing: "border-box",
    backgroundColor: itemColors[colorIndex].background,
    color: itemColors[colorIndex].text,
    width: width,
    height: 10,
    overflow: "hidden",
    textOverflow: "ellipsis",
    zIndex: 1,
}));

const Text = glamorous.div({
    cursor: "default",
    overflow: "hidden",
    textOverflow: "ellipsis",
});

const SvgIcon = glamorous.span(({ path }) => ({
    display: "inline-block",
    position: "relative",
    top: 2,
    width: 14,
    height: 14,
    background: `url(${path})`,
}));

storiesOf("MinimapChartItemPrototype", module).add("Default", () =>
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
);
