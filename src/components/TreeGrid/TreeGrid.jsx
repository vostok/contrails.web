// @flow
import * as React from "react";
import _ from "lodash";
import { Icon } from "ui";

import { reduceTree, findNodeToReducer } from "../../Domain/Utils/TreeTraverseUtils";

import cn from "./TreeGrid.less";

type ColumnDefintion<TItem> = {|
    name: string,
    renderHeader: () => React.Node,
    renderValue: TItem => React.Node,
    width?: number,
    align?: "right" | "left" | "center",
    mainCell?: boolean,
|};

type TreeGridProps<TItem> = {
    data: Array<TItem>,
    columns: Array<ColumnDefintion<TItem>>,
    focusedItem?: ?TItem,
    onItemClick?: TItem => void,
    expandedItems?: Array<TItem>,
    onGetItemColor?: TItem => ?string,
    onGetChildren: TItem => ?Array<TItem>,
    onChangeExpandedItems?: (Array<TItem>) => void,
    onChangeFocusedItem?: TItem => void,
};

type TreeGridState<TItem> = {
    expandedItems: Array<TItem>,
};

export default class TreeGrid<TItem> extends React.Component<TreeGridProps<TItem>, TreeGridState<TItem>> {
    props: TreeGridProps<TItem>;
    state: TreeGridState<TItem> = {
        expandedItems: [],
    };
    focusedRow: ?HTMLTableRowElement;

    componentWillMount() {
        if (this.props.focusedItem != null) {
            this.expandToFocusedItem(this.props.focusedItem);
        }
    }

    componentWillReceiveProps(nextProps: TreeGridProps<TItem>) {
        if (this.props.focusedItem !== nextProps.focusedItem) {
            if (nextProps.focusedItem != null) {
                this.expandToFocusedItem(nextProps.focusedItem);
            }
        }
    }

    expandToFocusedItem(item: TItem) {
        const nodes = this.findNodeTo(item);
        this.updateExpandedItems(expandedItems => _.union(expandedItems || [], nodes));
    }

    findNodeTo(item: TItem): TItem[] {
        const { data, onGetChildren } = this.props;
        const result = data
            .map(rootNode => reduceTree(rootNode, findNodeToReducer(item), onGetChildren))
            .reduce(flatten, []);

        return result.slice(1);
    }

    getItemColor(item: TItem): string {
        const { onGetItemColor } = this.props;
        const defaultColor = "#000";
        if (onGetItemColor != null) {
            return onGetItemColor(item) || defaultColor;
        }
        return defaultColor;
    }

    isItemExpanded(item: TItem): boolean {
        const expandedItems = this.props.expandedItems || this.state.expandedItems;
        return expandedItems.includes(item);
    }

    updateExpandedItems(updateAction: (Array<TItem>) => Array<TItem>) {
        if (this.props.expandedItems == null) {
            this.setState(({ expandedItems }) => ({ expandedItems: updateAction(expandedItems) }));
        } else {
            const { expandedItems, onChangeExpandedItems } = this.props;
            if (onChangeExpandedItems != null) {
                onChangeExpandedItems(updateAction(expandedItems));
            }
        }
    }

    handleToggleItemExpand(item: TItem) {
        this.updateExpandedItems(
            expandedItems =>
                expandedItems.includes(item) ? _.difference(expandedItems, [item]) : _.union(expandedItems, [item])
        );
    }

    renderParentBlock(item: TItem): React.Node {
        return (
            <div className={cn("parent-line")} style={{ backgroundColor: this.getItemColor(item) }}>
                &nbsp;
            </div>
        );
    }

    componentDidUpdate(prevProps: TreeGridProps<TItem>) {
        if (this.props.focusedItem !== prevProps.focusedItem) {
            if (this.focusedRow != null) {
                this.focusedRow.focus();
            }
        }
    }

    renderItem(key: string, item: TItem, parents: Array<TItem>): React.Node[] {
        const { onItemClick, onGetChildren, focusedItem } = this.props;
        const itemChildren = onGetChildren(item);
        const expanded = this.isItemExpanded(item);
        const isItemFocused = focusedItem === item;

        return [
            <tr
                ref={e => {
                    if (isItemFocused) {
                        this.focusedRow = e;
                    }
                }}
                tabIndex={-1}
                key={key}
                className={cn("item-row", { focused: isItemFocused })}
                onClick={() => {
                    if (onItemClick != null) {
                        onItemClick(item);
                    }
                }}>
                {this.renderCells(item, parents)}
            </tr>,
            ...(expanded
                ? (itemChildren || [])
                      .map((x, index) => this.renderItem(`${key}_${index}`, x, [...parents, item]))
                      .reduce(flatten, [])
                : []),
        ];
    }

    renderCells(item: TItem, parents: Array<TItem>): React.Node[] {
        const { columns } = this.props;
        return columns.map(x => this.renderCell(x, item, parents));
    }

    renderCell(column: ColumnDefintion<TItem>, item: TItem, parents: Array<TItem>): React.Node {
        const { onGetChildren } = this.props;
        const itemChildren = onGetChildren(item);
        const expanded = this.isItemExpanded(item);
        if (column.mainCell) {
            return (
                <td
                    key={column.name}
                    className={cn("item-cell", "main-cell")}
                    style={{
                        width: column.width,
                        maxWidth: column.width,
                        textAlign: column.align,
                    }}>
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
                        {column.renderValue(item)}
                    </span>
                </td>
            );
        }
        return (
            <td
                key={column.name}
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

    renderHeaderCell(column: ColumnDefintion<TItem>): React.Node {
        return (
            <th>
                {column.renderHeader()}
            </th>
        );
    }

    buildItemsFlatList(): Array<TItem> {
        const { data, onGetChildren } = this.props;

        const buildItemsFlatListFrom = (root: TItem): Array<TItem> => {
            const result = [root];
            if (this.isItemExpanded(root)) {
                for (const child of onGetChildren(root) || []) {
                    result.push(...buildItemsFlatListFrom(child));
                }
            }
            return result;
        };

        return data.map(x => buildItemsFlatListFrom(x)).reduce(flatten, []);
    }

    findPreviousExpandedItem(item: TItem): ?TItem {
        const flatList = this.buildItemsFlatList();
        const itemIndex = flatList.indexOf(item);
        return flatList[Math.max(itemIndex - 1, 0)];
    }

    findNextExpandedItem(item: TItem): ?TItem {
        const flatList = this.buildItemsFlatList();
        const itemIndex = flatList.indexOf(item);
        return flatList[Math.min(itemIndex + 1, flatList.length - 1)];
    }

    handleTableKeyPress = (e: SyntheticKeyboardEvent<HTMLTableElement>) => {
        const { focusedItem, onChangeFocusedItem, onGetChildren } = this.props;
        if (onChangeFocusedItem == null) {
            return;
        }
        if (focusedItem != null && e.key === "ArrowUp") {
            const prevItem = this.findPreviousExpandedItem(focusedItem);
            if (prevItem != null) {
                onChangeFocusedItem(prevItem);
            }
            e.stopPropagation();
            e.preventDefault();
        }
        if (focusedItem != null && e.key === "ArrowDown") {
            const prevItem = this.findNextExpandedItem(focusedItem);
            if (prevItem != null) {
                onChangeFocusedItem(prevItem);
            }
            e.stopPropagation();
            e.preventDefault();
        }
        if (focusedItem != null && e.key === "ArrowLeft") {
            if (this.isItemExpanded(focusedItem))
                this.updateExpandedItems(expandedItems => _.difference(expandedItems, [focusedItem]));
            e.stopPropagation();
            e.preventDefault();
        }
        if (focusedItem != null && e.key === "ArrowRight") {
            if (!this.isItemExpanded(focusedItem) && (onGetChildren(focusedItem) || []).length > 0)
                this.updateExpandedItems(expandedItems => _.union(expandedItems, [focusedItem]));
            e.stopPropagation();
            e.preventDefault();
        }
    };

    render(): React.Node {
        const { data } = this.props;
        const { columns } = this.props;

        return (
            <div className={cn("scroll-container")} tabIndex={0}>
                <table onKeyDown={this.handleTableKeyPress} className={cn("table")}>
                    <thead>
                        <tr tabIndex={-1} className={cn("head-row")}>
                            {columns.map(x => this.renderHeaderCell(x))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((x, index) => this.renderItem(index.toString(), x, []))}
                    </tbody>
                </table>
            </div>
        );
    }
}

function flatten<T>(memo: Array<T>, item: Array<T>): Array<T> {
    return [...memo, ...item];
}
