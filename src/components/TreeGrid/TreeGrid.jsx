// @flow
import * as React from "react";
import _ from "lodash";
import { Icon } from "ui";

import { reduceTree, findNodeToReducer } from "../../Domain/Utils/TreeTraverseUtils";
import VirtualTable from "../VirtualTable/VirtualTable";

import cn from "./TreeGrid.less";

type ColumnDefintion<TItem> = {|
    name: string,
    renderHeader: () => React.Node,
    renderValue: (item: TItem, focused: boolean) => React.Node,
    width?: number,
    align?: "right" | "left" | "center",
    mainCell?: boolean,
|};

type TreeGridProps<TItem> = {
    data: Array<TItem>,
    columns: Array<ColumnDefintion<TItem>>,
    focusedItem?: ?TItem,
    onItemClick?: TItem => void,
    expandedItems: Array<TItem>,
    onGetItemColor?: TItem => ?string,
    onGetChildren: TItem => ?Array<TItem>,
    onChangeExpandedItems: (Array<TItem>) => void,
    onChangeFocusedItem?: TItem => void,
};

type TreeGridState<TItem> = {
    visibleRows: Array<VisibleRowInfo<TItem>>,
};

type VisibleRowInfo<TItem> = {
    item: TItem,
    parents: TItem[],
    key: string,
};

export default class TreeGrid<TItem> extends React.Component<TreeGridProps<TItem>, TreeGridState<TItem>> {
    props: TreeGridProps<TItem>;
    state: TreeGridState<TItem> = {
        visibleRows: [],
    };
    focusedRow: ?HTMLTableRowElement;
    table: ?VirtualTable<VisibleRowInfo<TItem>>;

    componentWillMount() {
        const expandedItems = this.getExpandedForFocusedItemAndUpdate(this.props.focusedItem, this.props.expandedItems);
        const rows = this.buildRows(this.props.data, expandedItems);
        this.setState({
            visibleRows: rows,
        });
    }

    componentWillReceiveProps(nextProps: TreeGridProps<TItem>) {
        const expandedItems = this.getExpandedForFocusedItem(this.props.focusedItem, this.props.expandedItems);
        const nextExpandedItems = this.getExpandedForFocusedItemAndUpdate(
            nextProps.focusedItem,
            nextProps.expandedItems
        );
        if (expandedItems !== nextExpandedItems) {
            const rows = this.buildRows(nextProps.data, nextExpandedItems);
            this.setState({
                visibleRows: rows,
            });
        }
    }

    buildRows(data: Array<TItem>, expandedItems: Array<TItem>): Array<VisibleRowInfo<TItem>> {
        return data
            .map((x, index) => this.buildVisibleRows(index.toString(), x, [], expandedItems))
            .reduce(flatten, []);
    }

    buildVisibleRows(
        key: string,
        item: TItem,
        parents: TItem[],
        expandedItems: Array<TItem>
    ): Array<VisibleRowInfo<TItem>> {
        const { onGetChildren } = this.props;
        const itemChildren = onGetChildren(item);
        const expanded = expandedItems.includes(item);

        return [
            {
                item: item,
                key: key,
                parents: parents,
            },
            ...(expanded
                ? (itemChildren || [])
                      .map((x, index) => this.buildVisibleRows(`${key}_${index}`, x, [...parents, item], expandedItems))
                      .reduce(flatten, [])
                : []),
        ];
    }

    getExpandedForFocusedItemAndUpdate(focusedItem: ?TItem, expandedItems: Array<TItem>): Array<TItem> {
        const { onChangeExpandedItems } = this.props;
        if (focusedItem == null) {
            return expandedItems;
        }
        const nodes = this.findNodeTo(focusedItem);
        if (nodes.every(x => expandedItems.includes(x))) {
            return expandedItems;
        }
        onChangeExpandedItems(_.union(expandedItems || [], nodes));
        return _.union(expandedItems || [], nodes);
    }

    getExpandedForFocusedItem(focusedItem: ?TItem, expandedItems: Array<TItem>): Array<TItem> {
        if (focusedItem == null) {
            return expandedItems;
        }
        const nodes = this.findNodeTo(focusedItem);
        if (nodes.every(x => expandedItems.includes(x))) {
            return expandedItems;
        }
        return _.union(expandedItems || [], nodes);
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

    updateExpandedItems(updateAction: (Array<TItem>) => Array<TItem>) {
        const { expandedItems, onChangeExpandedItems } = this.props;
        onChangeExpandedItems(updateAction(expandedItems));
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
            const item = this.state.visibleRows.find(x => x.item === this.props.focusedItem);
            if (item != null && this.table != null) {
                this.table.scrollIntoView(item);
            }
        }
    }

    renderVisibleRow(visibleRowInfo: VisibleRowInfo<TItem>): React.Node[] {
        const { key, item, parents } = visibleRowInfo;
        const { onItemClick, focusedItem } = this.props;
        const isItemFocused = focusedItem === item;

        return (
            <tr
                tabIndex={-1}
                key={key}
                className={cn("item-row", { focused: isItemFocused })}
                onClick={() => {
                    if (onItemClick != null) {
                        onItemClick(item);
                    }
                }}>
                {this.renderCells(item, parents)}
            </tr>
        );
    }

    renderCells(item: TItem, parents: Array<TItem>): React.Node[] {
        const { columns } = this.props;
        return columns.map(x => this.renderCell(x, item, parents));
    }

    renderCell(column: ColumnDefintion<TItem>, item: TItem, parents: Array<TItem>): React.Node {
        const { onGetChildren, focusedItem } = this.props;
        const itemChildren = onGetChildren(item);
        const expanded = this.props.expandedItems.includes(item);

        if (column.mainCell) {
            return (
                <td
                    key={column.name}
                    className={cn("item-cell", "main-cell")}
                    style={{
                        width: column.width || "100%",
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
                        {column.renderValue(item, focusedItem === item)}
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
                {column.renderValue(item, focusedItem === item)}
            </td>
        );
    }

    renderHeaderCell(column: ColumnDefintion<TItem>): React.Node {
        return (
            <th
                style={{
                    width: column.width,
                    maxWidth: column.width,
                    textAlign: column.align,
                }}>
                {column.renderHeader()}
            </th>
        );
    }

    buildItemsFlatList(): Array<TItem> {
        const { data, onGetChildren } = this.props;

        const buildItemsFlatListFrom = (root: TItem): Array<TItem> => {
            const result = [root];
            if (this.props.expandedItems.includes(root)) {
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
            if (this.props.expandedItems.includes(focusedItem))
                this.updateExpandedItems(expandedItems => _.difference(expandedItems, [focusedItem]));
            e.stopPropagation();
            e.preventDefault();
        }
        if (focusedItem != null && e.key === "ArrowRight") {
            if (!this.props.expandedItems.includes(focusedItem) && (onGetChildren(focusedItem) || []).length > 0)
                this.updateExpandedItems(expandedItems => _.union(expandedItems, [focusedItem]));
            e.stopPropagation();
            e.preventDefault();
        }
    };

    render(): React.Node {
        const { columns } = this.props;

        return (
            <VirtualTable
                ref={x => (this.table = x)}
                onKeyDown={this.handleTableKeyPress}
                tableClassName={cn("table")}
                renderHeader={() =>
                    <tr tabIndex={-1} className={cn("head-row")}>
                        {columns.map(x => this.renderHeaderCell(x))}
                    </tr>}
                headerHeight={30}
                rowHeight={30}
                renderRow={x => this.renderVisibleRow(x)}
                data={this.state.visibleRows}
            />
        );
    }
}

function flatten<T>(memo: Array<T>, item: Array<T>): Array<T> {
    for (let i = 0; i < item.length; i++) {
        memo.push(item[i]);
    }
    return memo;
}

export function withExpandedItems<T, Props: {}>(
    Component: React.ComponentType<
        {
            expandedItems: Array<T>,
            onChangeExpandedItems: (Array<T>) => void,
        } & Props
    >
): React.ComponentType<Props> {
    return class ExpandedItemsContainer extends React.Component<Props, *> {
        props: Props;
        state: {
            expandedItems: Array<T>,
        } = {
            expandedItems: [],
        };

        render(): React.Node {
            return (
                <Component
                    {...this.props}
                    onChangeExpandedItems={x => this.setState({ expandedItems: x })}
                    expandedItems={this.state.expandedItems}
                />
            );
        }
    };
}
