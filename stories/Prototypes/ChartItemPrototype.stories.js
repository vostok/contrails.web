// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Icon } from "ui";

import ServiceIcon from "../../src/components/Icons/service.svg";
import CassandraIcon from "../../src/components/Icons/cassandra.svg";
import DatabaseIcon from "../../src/components/Icons/db.svg";
import itemColors from "../../src/Domain/Colors";

function Line({ children }: { children: React.Node }): React.Node {
    return (
        <div
            style={{
                position: "relative",
                height: 52,
            }}>
            {children}
        </div>
    );
}

function Text({ children }: { children: React.Node }): React.Node {
    return (
        <div
            style={{
                cursor: "default",
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}>
            {children}
        </div>
    );
}

function SvgIcon({ path }: { path: string }): React.Node {
    return (
        <span
            style={{
                display: "inline-block",
                position: "relative",
                top: 2,
                width: 14,
                height: 14,
                background: `url(${path})`,
            }}
        />
    );
}

type ItemProps = {
    children: React.Node,
    width: number,
    colorIndex: number,
    focused?: boolean,
    style?: {},
};

function Item({ children, width, colorIndex, focused, style }: ItemProps): React.Node {
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
                width: width,
                height: 50,
                overflow: "hidden",
                textOverflow: "ellipsis",
                zIndex: 1,
                ...(focused
                    ? {
                          border: `3px solid ${itemColors[colorIndex].border}`,
                          padding: "1px 5px",
                      }
                    : {}),
                ...style,
            }}>
            {children}
        </div>
    );
}

storiesOf("Prototypes/ChartItemPrototype", module).add("Default", () =>
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
