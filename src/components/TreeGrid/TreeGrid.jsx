// @flow
import * as React from "react";
import _ from "lodash";
import { Icon } from "ui";

import { reduceTree, findNodeToReducer } from "../../Domain/Utils/TreeTraverseUtils";

import cn from "./TreeGrid.less";

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
    onItemClick?: TItem => void,
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
            <td
                className={cn("item-cell")}
                style={{
                    width: column.width,
                    maxWidth: column.width,
                    textAlign: column.align,
                }}>
                {column.renderValue(item)}
            </td>
        );
    }

    componentWillReceiveProps(nextProps: TreeGridProps<TItem>) {
        if (this.props.focusedItem !== nextProps.focusedItem) {
            if (nextProps.focusedItem != null) {
                this.updateFocusedItem(nextProps.focusedItem);
            }
        }
    }

    updateFocusedItem(item: TItem) {
        const nodes = this.findNodeTo(item);
        this.setState(({ expandedItems }) => ({
            expandedItems: _.union(expandedItems || [], nodes),
        }));
    }

    findNodeTo(item: TItem): TItem[] {
        const { data, onGetChildren } = this.props;
        return data
            .map(rootNode => reduceTree(rootNode, findNodeToReducer(item), onGetChildren))
            .reduce((x, y) => [...x, ...y], []);
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
        return (
            <div className={cn("parent-line")} style={{ backgroundColor: this.getItemColor(item) }}>
                &nbsp;
            </div>
        );
    }

    renderItem(item: TItem, parents: Array<TItem>): React.Element<*>[] {
        const { onItemClick, onGetChildren, columns } = this.props;
        const itemChildren = onGetChildren(item);
        const expanded = this.isItemExpanded(item);
        return [
            <tr
                className={cn("item-row")}
                onClick={() => {
                    if (onItemClick != null) {
                        onItemClick(item);
                    }
                }}>
                <td className={cn("first-item-cell")}>
                    {parents.map(x => this.renderParentBlock(x))}
                    <span>
                        <button
                            className={cn("expand-button")}
                            onClick={(e: SyntheticEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                this.handleToggleItemExpand(item);
                            }}>
                            {itemChildren != null &&
                                itemChildren.length > 0 &&
                                <Icon name={expanded ? "ArrowTriangleDown" : "ArrowTriangleRight"} />}
                        </button>
                        {this.renderCellValue(item, columns[0])}
                    </span>
                </td>
                {columns.slice(1).map(x => this.renderCell(item, x))}
            </tr>,
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
            <div className={cn("scroll-container")}>
                <table className={cn("table")}>
                    <thead>
                        <tr className={cn("head-row")}>
                            {columns.map(x => this.renderHeaderCell(x))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(x => this.renderItem(x, []))}
                    </tbody>
                </table>
            </div>
        );
    }
}

function flatten<T>(memo: Array<T>, item: Array<T>): Array<T> {
    return [...memo, ...item];
}
