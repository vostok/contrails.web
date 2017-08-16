// @flow
import React from "react";
import _ from "lodash";
import glamorous from "glamorous";

import { Icon } from "ui";

type TreeGridItem = {
    children: ?Array<TreeGridItem>,
};

type ColumnDefintion<TItem> = {
    renderHeader: () => string | React.Element<*>,
    renderValue: TItem => string | React.Element<*>,
};

type TreeGridProps<TItem: TreeGridItem> = {
    data: Array<TItem>,
    columns: Array<ColumnDefintion<TItem>>,
    focusedItem?: TItem,
    expandedItems?: Array<TItem>,
    onChangeExpandedItems?: (Array<TItem>) => void,
};

type TreeGridState<TItem: TreeGridItem> = {
    expandedItems: Array<TItem>,
};

export default class TreeGrid<TItem: TreeGridItem> extends React.Component<*, TreeGridProps<TItem>, *> {
    props: TreeGridProps<TItem>;
    state: TreeGridState<TItem> = {
        expandedItems: [],
    };

    renderCell(item: TItem, column: ColumnDefintion<TItem>): React.Element<*> {
        return (
            <ItemCell>
                {column.renderValue(item)}
            </ItemCell>
        );
    }

    renderCellValue(item: TItem, column: ColumnDefintion<TItem>): string | React.Element<*> {
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

    renderParentBlock(_item: TItem): React.Element<*> {
        return <ParentLine>&nbsp;</ParentLine>;
    }

    renderItem(item: TItem, parents: Array<TItem>): React.Element<*>[] {
        const { columns } = this.props;
        const expanded = this.isItemExpanded(item);
        return [
            <ItemRow>
                <FirstItemCell>
                    {parents.map(x => this.renderParentBlock(x))}
                    <span>
                        <ExpandButton onClick={() => this.handleToggleItemExpand(item)}>
                            {item.children != null &&
                                item.children.length > 0 &&
                                <Icon name={expanded ? "ArrowTriangleDown" : "ArrowTriangleRight"} />}
                        </ExpandButton>
                        {this.renderCellValue(item, columns[0])}
                    </span>
                </FirstItemCell>
                {columns.slice(1).map(x => this.renderCell(item, x))}
            </ItemRow>,
            ...(this.isItemExpanded(item)
                ? (item.children || []).map(x => this.renderItem(x, [...parents, item])).reduce(flatten, [])
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
        );
    }
}

function flatten<T>(memo: Array<T>, item: Array<T>): Array<T> {
    return [...memo, ...item];
}

const ParentLine = glamorous.div({
    display: "inline-block",
    marginLeft: 10,
    width: 1,
    height: 30,
    marginRight: 9,
    padding: 0,
    backgroundColor: "#000",
});

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

const ItemCell = glamorous.td({
    borderLeft: "1px solid #ddd",
    borderRight: "1px solid #ddd",
    lineHeight: "30px",
    verticalAlign: "baseline",
    height: 30,
    padding: "0 10px",
    margin: 0,
});
