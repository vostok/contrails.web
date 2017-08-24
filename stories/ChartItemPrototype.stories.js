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
    position: "relative",
    height: 52,
});

const Item = glamorous.div(
    ({ width, colorIndex }) => ({
        border: `1px solid ${itemColors[colorIndex].border}`,
        position: "relative",
        display: "inline-block",
        marginTop: 1,
        padding: "3px 7px",
        boxSizing: "border-box",
        backgroundColor: itemColors[colorIndex].background,
        color: itemColors[colorIndex].text,
        width: width,
        height: 50,
        overflow: "hidden",
        textOverflow: "ellipsis",
        zIndex: 1,

        "&:hover": {
            backgroundColor: itemColors[colorIndex].hoverBackground,
            color: itemColors[colorIndex].hoverText,
            zIndex: 2,
        },
    }),
    ({ focused, colorIndex }: { focused?: boolean, colorIndex: number }) =>
        focused
            ? {
                  border: `3px solid ${itemColors[colorIndex].border}`,
                  padding: "1px 5px",
              }
            : {}
);

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

storiesOf("ChartItemPrototype", module).add("Default", () =>
    <div
        style={{
            padding: 20,
        }}>
        <Line>
            <Item focused width={300} colorIndex={0}>
                <Text>
                    <SvgIcon path={ServiceIcon} /> Billy.ServerName.ServiceName
                </Text>
                <Text>/do/something/veryvery/very/long/action/and/more/more</Text>
            </Item>
        </Line>
        <Line>
            <Item width={200} colorIndex={1}>
                <Text>
                    <SvgIcon path={CassandraIcon} /> Cassandra
                </Text>
                <Text>/trygetcolumn</Text>
            </Item>
            <Item width={200} colorIndex={1}>
                <Text>
                    <SvgIcon path={CassandraIcon} /> Cassandra
                </Text>
                <Text>/trygetcolumn</Text>
            </Item>
            <Item focused width={200} colorIndex={1}>
                <Text>
                    <SvgIcon path={CassandraIcon} /> Cassandra
                </Text>
                <Text>/trygetcolumn</Text>
            </Item>
        </Line>
        <Line>
            <Item width={200} colorIndex={2}>
                <Text>
                    <SvgIcon path={DatabaseIcon} /> Cassandra
                </Text>
                <Text>/trygetcolumn</Text>
            </Item>
        </Line>
        <Line>
            <Item width={200} colorIndex={3}>
                <Text>
                    <Icon name="PC" /> Cassandra
                </Text>
                <Text>/trygetcolumn</Text>
            </Item>
        </Line>
        <Line>
            <Item width={200} colorIndex={4}>
                <Text>
                    <Icon name="PC" /> Cassandra
                </Text>
                <Text>/trygetcolumn</Text>
            </Item>
            <Item width={200} colorIndex={4} style={{ marginLeft: -80, position: "relative", top: 4 }}>
                <Text>
                    <Icon name="PC" /> Cassandra
                </Text>
                <Text>/trygetcolumn</Text>
            </Item>
        </Line>
        <Line>
            <Item width={200} colorIndex={4}>
                <Text>
                    <Icon name="PC" /> Cassandra
                </Text>
                <Text>/trygetcolumn</Text>
            </Item>
            <Item width={200} colorIndex={4} style={{ marginLeft: -10, position: "relative", top: 4 }}>
                <Text>
                    <Icon name="PC" /> Cassandra
                </Text>
                <Text>/trygetcolumn</Text>
            </Item>
        </Line>
        <Line>
            <Item width={300} colorIndex={4}>
                <Text>
                    <Icon name="PC" /> Cassandra
                </Text>
                <Text>/trygetcolumn</Text>
            </Item>
            <Item width={100} colorIndex={4} style={{ marginLeft: -300, position: "relative", top: 4 }}>
                <Text>
                    <Icon name="PC" /> Cassandra
                </Text>
                <Text>/trygetcolumn</Text>
            </Item>
        </Line>
    </div>
);
