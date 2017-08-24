// @flow
import * as React from "react";
import _ from "lodash";
import glamorous from "glamorous";

import { Icon } from "ui";

type ColumnDefintion<TItem> = {
    renderHeader: () => React.Node,
    renderValue: TItem => React.Node,
    width?: number,
    align?: "right" | "left" | "center",
};

type TreeGridProps<TItem> = {
    data: Array<TItem>,
    columns: Array<ColumnDefintion<TItem>>,
    focusedItem?: ?TItem,
    expandedItems?: Array<TItem>,
    onGetItemColor?: TItem => ?string,
    onGetChildren: TItem => ?Array<TItem>,
    onChangeExpandedItems?: (Array<TItem>) => void,
};

type TreeGridState<TItem> = {
    expandedItems: Array<TItem>,
};

export default class TreeGrid<TItem> extends React.Component<TreeGridProps<TItem>, TreeGridState<TItem>> {
    props: TreeGridProps<TItem>;
    state: TreeGridState<TItem> = {
        expandedItems: [],
    };

    getItemColor(item: TItem): string {
        const { onGetItemColor } = this.props;
        const defaultColor = "#000";
        if (onGetItemColor != null) {
            return onGetItemColor(item) || defaultColor;
        }
        return defaultColor;
    }

    renderCell(item: TItem, column: ColumnDefintion<TItem>): React.Node {
        return (
            <ItemCell width={column.width} align={column.align}>
                {column.renderValue(item)}
            </ItemCell>
        );
    }

    renderCellValue(item: TItem, column: ColumnDefintion<TItem>): React.Node {
        return column.renderValue(item);
    }

    isItemExpanded(item: TItem): boolean {
        const expandedItems = this.props.expandedItems || this.state.expandedItems;
        return expandedItems.includes(item);
    }

    handleToggleItemExpand(item: TItem) {
        let expandedItems = this.props.expandedItems || this.state.expandedItems;
        if (expandedItems.includes(item)) {
            expandedItems = _.difference(expandedItems, [item]);
        } else {
            expandedItems = _.union(expandedItems, [item]);
        }

        if (this.props.expandedItems == null) {
            this.setState({ expandedItems: expandedItems });
        } else {
            const { onChangeExpandedItems } = this.props;
            if (onChangeExpandedItems != null) {
                onChangeExpandedItems(expandedItems);
            }
        }
    }

    renderParentBlock(item: TItem): React.Element<*> {
        return <ParentLine color={this.getItemColor(item)}>&nbsp;</ParentLine>;
    }

    renderItem(item: TItem, parents: Array<TItem>): React.Element<*>[] {
        const { onGetChildren, columns } = this.props;
        const itemChildren = onGetChildren(item);
        const expanded = this.isItemExpanded(item);
        return [
            <ItemRow>
                <FirstItemCell>
                    {parents.map(x => this.renderParentBlock(x))}
                    <span>
                        <ExpandButton onClick={() => this.handleToggleItemExpand(item)}>
                            {itemChildren != null &&
                                itemChildren.length > 0 &&
                                <Icon name={expanded ? "ArrowTriangleDown" : "ArrowTriangleRight"} />}
                        </ExpandButton>
                        {this.renderCellValue(item, columns[0])}
                    </span>
                </FirstItemCell>
                {columns.slice(1).map(x => this.renderCell(item, x))}
            </ItemRow>,
            ...(this.isItemExpanded(item)
                ? (itemChildren || []).map(x => this.renderItem(x, [...parents, item])).reduce(flatten, [])
                : []),
        ];
    }

    renderHeaderCell(column: ColumnDefintion<TItem>): React.Element<*> {
        return (
            <th>
                {column.renderHeader()}
            </th>
        );
    }

    render(): React.Element<*> {
        const { data } = this.props;
        const { columns } = this.props;

        return (
            <ScrollContainer>
                <Table>
                    <thead>
                        <HeadRow>
                            {columns.map(x => this.renderHeaderCell(x))}
                        </HeadRow>
                    </thead>
                    <tbody>
                        {data.map(x => this.renderItem(x, []))}
                    </tbody>
                </Table>
            </ScrollContainer>
        );
    }
}

function flatten<T>(memo: Array<T>, item: Array<T>): Array<T> {
    return [...memo, ...item];
}

const ScrollContainer = glamorous.div({
    position: "absolute",
    overflowY: "scroll",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
});

const ParentLine = glamorous.div(
    {
        display: "inline-block",
        marginLeft: 10,
        width: 1,
        height: 30,
        marginRight: 9,
        padding: 0,
        backgroundColor: "#000",
    },
    ({ color }) => ({
        backgroundColor: color,
    })
);

const ExpandButton = glamorous.button({
    width: 20,
    border: 0,
    padding: 0,
    background: "transparent",
});

const Table = glamorous.table({
    width: "100%",
    border: 0,
    borderCollapse: "collapse",
});

const ItemRow = glamorous.tr({});

const HeadRow = glamorous.tr({
    borderBottom: "1px solid #ddd",
    " th": {
        borderRight: "1px solid #ddd",
    },
});

const FirstItemCell = glamorous.td({
    lineHeight: "30px",
    verticalAlign: "baseline",
    height: 30,
    padding: 0,
    margin: 0,
    paddingRight: "10px",
});

const ItemCell = glamorous.td(
    {
        position: "relative",
        borderLeft: "1px solid #ddd",
        borderRight: "1px solid #ddd",
        lineHeight: "30px",
        verticalAlign: "baseline",
        height: 30,
        padding: "0 10px",
        margin: 0,
    },
    ({ width, align }) => ({
        width: width,
        maxWidth: width,
        textAlign: align,
    })
);
