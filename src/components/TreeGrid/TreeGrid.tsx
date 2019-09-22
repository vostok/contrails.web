import _ from "lodash";
import * as React from "react";

import { ArrowTriangleDown, ArrowTriangleRight } from "../../Commons/ui";
import { findNodeToReducer, reduceTree } from "../../Domain/Utils/TreeTraverseUtils";
import { VirtualTable } from "../VirtualTable/VirtualTable";

import cn from "./TreeGrid.less";

interface ColumnDefinition<TItem> {
    name: string;
    renderHeader: () => React.ReactNode;
    renderValue: (item: TItem, focused: boolean) => React.ReactNode;
    width?: number;
    align?: "right" | "left" | "center";
    mainCell?: boolean;
    cellClassName?: string;
}

interface TreeGridProps<TItem> {
    data: TItem[];
    filterNodes: (item: TItem) => boolean;
    columns: Array<ColumnDefinition<TItem>>;
    focusedItem?: TItem;
    onItemClick?: (item: TItem) => void;
    expandedItems: TItem[];
    onGetItemColor?: (item: TItem) => undefined | string;
    onGetChildren: (item: TItem) => undefined | TItem[];
    onChangeExpandedItems: (items: TItem[]) => void;
    onChangeFocusedItem: (item: TItem) => void;
}

interface TreeGridState<TItem> {
    visibleRows: Array<VisibleRowInfo<TItem>>;
}

interface VisibleRowInfo<TItem> {
    item: TItem;
    parents: TItem[];
    key: string;
}

export class TreeGrid<TItem> extends React.Component<TreeGridProps<TItem>, TreeGridState<TItem>> {
    public state: TreeGridState<TItem> = {
        visibleRows: [],
    };

    public static defaultProps = {
        filterNodes: () => true,
    };

    private readonly table = React.createRef<VirtualTable<VisibleRowInfo<TItem>>>();

    public componentWillMount(): void {
        const expandedItems = this.getExpandedForFocusedItemAndUpdate(this.props.focusedItem, this.props.expandedItems);
        const rows = this.buildRows(this.props.data, expandedItems);
        this.setState({
            visibleRows: rows,
        });
    }

    public componentWillReceiveProps(nextProps: TreeGridProps<TItem>): void {
        const expandedItems = this.getExpandedForFocusedItem(this.props.focusedItem, this.props.expandedItems);
        const nextExpandedItems = this.getExpandedForFocusedItemAndUpdate(
            nextProps.focusedItem,
            nextProps.expandedItems
        );
        if (expandedItems !== nextExpandedItems || this.props.filterNodes !== nextProps.filterNodes) {
            const rows = this.buildRows(nextProps.data, nextExpandedItems);
            this.setState({
                visibleRows: rows,
            });
        }
    }

    public buildRows(data: TItem[], expandedItems: TItem[]): Array<VisibleRowInfo<TItem>> {
        return data
            .map((x, index) => this.buildVisibleRows(index.toString(), x, [], expandedItems))
            .reduce(flatten, []);
    }

    public isNodeVisibleRecursive(node: TItem): boolean {
        const { onGetChildren, filterNodes } = this.props;
        const itemChildren = onGetChildren(node);
        if (itemChildren == undefined || itemChildren.length === 0) {
            return filterNodes(node);
        }
        return filterNodes(node) || itemChildren.some(x => this.isNodeVisibleRecursive(x));
    }

    public buildVisibleRows(
        key: string,
        item: TItem,
        parents: TItem[],
        expandedItems: TItem[]
    ): Array<VisibleRowInfo<TItem>> {
        const { onGetChildren, filterNodes } = this.props;
        const itemChildren = onGetChildren(item);
        const expanded = expandedItems.includes(item);
        let visibleChildren: Array<VisibleRowInfo<TItem>> = [];
        if (itemChildren == undefined || itemChildren.length === 0) {
            if (!filterNodes(item)) {
                return [];
            }
        } else if (expanded) {
            visibleChildren = (itemChildren || [])
                .map((x, index) => this.buildVisibleRows(`${key}_${index}`, x, [...parents, item], expandedItems))
                .reduce(flatten, []);
            if (visibleChildren.length === 0) {
                if (!filterNodes(item)) {
                    return [];
                }
            }
        } else if (!this.isNodeVisibleRecursive(item)) {
            return [];
        }
        return [
            {
                item: item,
                key: key,
                parents: parents,
            },
            ...visibleChildren,
        ];
    }

    public getExpandedForFocusedItemAndUpdate(focusedItem: undefined | TItem, expandedItems: TItem[]): TItem[] {
        const { onChangeExpandedItems } = this.props;
        if (focusedItem == undefined) {
            return expandedItems;
        }
        const nodes = this.findNodeTo(focusedItem);
        if (nodes.every(x => expandedItems.includes(x))) {
            return expandedItems;
        }
        onChangeExpandedItems(_.union(expandedItems || [], nodes));
        return _.union(expandedItems || [], nodes);
    }

    public getExpandedForFocusedItem(focusedItem: undefined | TItem, expandedItems: TItem[]): TItem[] {
        if (focusedItem == undefined) {
            return expandedItems;
        }
        const nodes = this.findNodeTo(focusedItem);
        if (nodes.every(x => expandedItems.includes(x))) {
            return expandedItems;
        }
        return _.union(expandedItems || [], nodes);
    }

    public findNodeTo(item: TItem): TItem[] {
        const { data, onGetChildren } = this.props;
        const result = data
            .map(rootNode => reduceTree(rootNode, findNodeToReducer(item), onGetChildren))
            .reduce(flatten, []);

        return result.slice(1);
    }

    public getItemColor(item: TItem): string {
        const { onGetItemColor } = this.props;
        const defaultColor = "#000";
        if (onGetItemColor != undefined) {
            return onGetItemColor(item) || defaultColor;
        }
        return defaultColor;
    }

    public updateExpandedItems(updateAction: (items: TItem[]) => TItem[]): void {
        const { expandedItems, onChangeExpandedItems } = this.props;
        onChangeExpandedItems(updateAction(expandedItems));
    }

    public handleToggleItemExpand(item: TItem): void {
        const { focusedItem, expandedItems, onChangeExpandedItems, onChangeFocusedItem } = this.props;
        if (expandedItems.includes(item)) {
            if (focusedItem == undefined) {
                onChangeExpandedItems(_.difference(expandedItems, [item]));
            } else {
                const nodes = this.findNodeTo(focusedItem);
                const index = nodes.indexOf(item);
                if (index >= 0) {
                    const nodeToHide = nodes.slice(index);
                    onChangeFocusedItem(item);
                    onChangeExpandedItems(_.difference(expandedItems, nodeToHide));
                } else {
                    onChangeExpandedItems(_.difference(expandedItems, [item]));
                }
            }
        } else {
            onChangeExpandedItems(_.union(expandedItems, [item]));
        }
    }

    public renderParentBlock(item: TItem): JSX.Element {
        return (
            <div className={cn("parent-line")} style={{ backgroundColor: this.getItemColor(item) }}>
                &nbsp;
            </div>
        );
    }

    public componentDidUpdate(prevProps: TreeGridProps<TItem>): void {
        if (this.props.focusedItem !== prevProps.focusedItem) {
            const item = this.state.visibleRows.find(x => x.item === this.props.focusedItem);
            if (item != undefined && this.table.current != undefined) {
                this.table.current.scrollIntoView(item);
            }
        }
    }

    public renderCells(item: TItem, parents: TItem[]): React.ReactNode {
        const { columns } = this.props;
        return columns.map(x => this.renderCell(x, item, parents));
    }

    public renderCell(column: ColumnDefinition<TItem>, item: TItem, parents: TItem[]): JSX.Element {
        const { onGetChildren, focusedItem } = this.props;
        const itemChildren = onGetChildren(item);
        const expanded = this.props.expandedItems.includes(item);

        if (column.mainCell) {
            return (
                <td
                    key={column.name}
                    className={cn("item-cell", "main-cell", column.cellClassName)}
                    style={{
                        width: column.width || "100%",
                    }}>
                    {parents.map(x => this.renderParentBlock(x))}
                    <span>
                        <button
                            className={cn("expand-button")}
                            onClick={(e: React.SyntheticEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                this.handleToggleItemExpand(item);
                            }}>
                            {itemChildren != undefined &&
                                itemChildren.length > 0 &&
                                (expanded ? <ArrowTriangleDown /> : <ArrowTriangleRight />)}
                        </button>
                        {column.renderValue(item, focusedItem === item)}
                    </span>
                </td>
            );
        }
        return (
            <td
                key={column.name}
                className={cn("item-cell", column.cellClassName)}
                style={{
                    width: column.width,
                    maxWidth: column.width,
                    textAlign: column.align,
                }}>
                {column.renderValue(item, focusedItem === item)}
            </td>
        );
    }

    public renderHeaderCell(column: ColumnDefinition<TItem>): React.ReactNode {
        return (
            <th
                key={column.name}
                style={{
                    width: column.width,
                    maxWidth: column.width,
                }}>
                {column.renderHeader()}
            </th>
        );
    }

    public buildItemsFlatList(): TItem[] {
        const { data, onGetChildren } = this.props;

        const buildItemsFlatListFrom = (root: TItem): TItem[] => {
            const result = [root];
            if (this.props.expandedItems.includes(root)) {
                for (const child of onGetChildren(root) || []) {
                    result.push(...buildItemsFlatListFrom(child));
                }
            }
            return result;
        };

        return data.map(buildItemsFlatListFrom).reduce(flatten, []);
    }

    public findPreviousExpandedItem(item: TItem): undefined | TItem {
        const flatList = this.buildItemsFlatList();
        const itemIndex = flatList.indexOf(item);
        return flatList[Math.max(itemIndex - 1, 0)];
    }

    public findNextExpandedItem(item: TItem): undefined | TItem {
        const flatList = this.buildItemsFlatList();
        const itemIndex = flatList.indexOf(item);
        return flatList[Math.min(itemIndex + 1, flatList.length - 1)];
    }

    public handleTableKeyPress = (e: React.KeyboardEvent<HTMLTableElement>) => {
        const { focusedItem, onChangeFocusedItem, onGetChildren } = this.props;
        if (onChangeFocusedItem == undefined) {
            return;
        }
        if (focusedItem != undefined && e.key === "ArrowUp") {
            const prevItem = this.findPreviousExpandedItem(focusedItem);
            if (prevItem != undefined) {
                onChangeFocusedItem(prevItem);
            }
            e.stopPropagation();
            e.preventDefault();
        }
        if (focusedItem != undefined && e.key === "ArrowDown") {
            const prevItem = this.findNextExpandedItem(focusedItem);
            if (prevItem != undefined) {
                onChangeFocusedItem(prevItem);
            }
            e.stopPropagation();
            e.preventDefault();
        }
        if (focusedItem != undefined && e.key === "ArrowLeft") {
            if (this.props.expandedItems.includes(focusedItem)) {
                this.updateExpandedItems(expandedItems => _.difference(expandedItems, [focusedItem]));
            }
            e.stopPropagation();
            e.preventDefault();
        }
        if (focusedItem != undefined && e.key === "ArrowRight") {
            if (!this.props.expandedItems.includes(focusedItem) && (onGetChildren(focusedItem) || []).length > 0) {
                this.updateExpandedItems(expandedItems => _.union(expandedItems, [focusedItem]));
            }
            e.stopPropagation();
            e.preventDefault();
        }
    };

    public render(): JSX.Element {
        return (
            <VirtualTable
                ref={this.table}
                onKeyDown={this.handleTableKeyPress}
                tableClassName={cn("table")}
                renderHeader={this.renderHeader}
                headerHeight={16}
                rowHeight={20}
                renderRow={this.renderVisibleRow}
                data={this.state.visibleRows}
            />
        );
    }

    private readonly renderVisibleRow = (visibleRowInfo: VisibleRowInfo<TItem>): React.ReactNode => {
        const { key, item, parents } = visibleRowInfo;
        const { onItemClick, focusedItem } = this.props;
        const isItemFocused = focusedItem === item;

        return (
            <tr
                key={key}
                className={cn("item-row", { focused: isItemFocused })}
                onClick={() => {
                    if (onItemClick != undefined) {
                        onItemClick(item);
                    }
                }}>
                {this.renderCells(item, parents)}
            </tr>
        );
    };

    private readonly renderHeader = () => {
        const { columns } = this.props;
        return <tr className={cn("head-row")}>{columns.map(x => this.renderHeaderCell(x))}</tr>;
    };
}

function flatten<T>(memo: T[], items: T[]): T[] {
    for (const item of items) {
        memo.push(item);
    }
    return memo;
}

export function withExpandedItems(
    Component: new <TItem>(props: TreeGridProps<TItem>) => TreeGrid<TItem>
): new <TItem>(props: Omit<TreeGridProps<TItem>, "onChangeExpandedItems" | "expandedItems">) => React.Component<
    Omit<TreeGridProps<TItem>, "onChangeExpandedItems" | "expandedItems">
> {
    return class ExpandedItemsContainer<TItem> extends React.Component<
        Omit<TreeGridProps<TItem>, "onChangeExpandedItems" | "expandedItems">,
        { expandedItems: TItem[] }
    > {
        public state: { expandedItems: TItem[] } = { expandedItems: [] };

        public render(): JSX.Element {
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
