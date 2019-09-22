import _ from "lodash";
import * as React from "react";

import cn from "./VirtualTable.less";

interface VirtualTableProps<T> {
    data: T[];
    renderHeader: () => React.ReactNode;
    renderRow: (item: T) => React.ReactNode;
    rowHeight: number;
    headerHeight: number;
    tableClassName?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTableElement>) => void;
}

interface RowRange {
    from: number;
    to: number;
}

const additionalRowCountToRender = 40;

export class VirtualTable<T> extends React.Component<VirtualTableProps<T>> {
    private readonly scrollContainer = React.createRef<HTMLDivElement>();
    private readonly bottomOffsetRow = React.createRef<HTMLDivElement>();
    private readonly topOffsetRow = React.createRef<HTMLDivElement>();
    private readonly updateDebounced: (e: React.SyntheticEvent) => void;

    public constructor(props: VirtualTableProps<T>) {
        super(props);
        this.updateDebounced = _.debounce(this.updatePosition, 100);
    }

    // public shouldComponentUpdate(nextProps: VirtualTableProps<T>): boolean {
    //     return (
    //         nextProps.data !== this.props.data ||
    //         nextProps.renderHeader !== this.props.renderHeader ||
    //         nextProps.renderRow !== this.props.renderRow ||
    //         nextProps.rowHeight !== this.props.rowHeight ||
    //         nextProps.headerHeight !== this.props.headerHeight ||
    //         nextProps.tableClassName !== this.props.tableClassName ||
    //         nextProps.onKeyDown !== this.props.onKeyDown
    //     );
    // }

    public componentDidMount(): void {
        this.updatePosition();
    }

    public componentDidUpdate(prevProps: VirtualTableProps<T>): void {
        if (this.props.data !== prevProps.data) {
            this.updatePosition();
        }
    }

    public render(): JSX.Element {
        const { data, renderRow, headerHeight, rowHeight, renderHeader, tableClassName, onKeyDown } = this.props;
        const renderRange = this.getRowRangeToRender();
        const height = rowHeight * data.length;
        const topOffset = renderRange.from * rowHeight;
        const bottomOffset = height - renderRange.to * rowHeight;

        return (
            <div className={cn("root")}>
                <table className={cn("table", tableClassName)}>
                    <thead>{renderHeader()}</thead>
                </table>
                <div
                    className={cn("scroll-container")}
                    style={{ top: headerHeight }}
                    onScroll={this.handleScroll}
                    ref={this.scrollContainer}>
                    <div ref={this.topOffsetRow} style={{ height: topOffset }} />
                    <table tabIndex={-1} className={cn("table", tableClassName)} onKeyDown={onKeyDown}>
                        <tbody>{data.slice(renderRange.from, renderRange.to).map(renderRow)}</tbody>
                    </table>
                    <div
                        ref={this.bottomOffsetRow}
                        style={
                            // @ts-ignore TODO
                            { bottomOffset: bottomOffset }
                        }
                    />
                </div>
            </div>
        );
    }

    public scrollIntoView(item: T): void {
        const scrollContainer = this.scrollContainer.current;
        if (scrollContainer != undefined) {
            const { rowHeight } = this.props;
            const visibleRowRange = this.getVisibleRowRange();
            const focusedIndex = this.props.data.indexOf(item);
            const viewPortHeight = scrollContainer.getBoundingClientRect().height;

            let scrollTop;
            if (visibleRowRange.from > focusedIndex) {
                scrollTop = focusedIndex * rowHeight;
                scrollContainer.scrollTop = scrollTop;
            } else if (visibleRowRange.to <= focusedIndex) {
                scrollTop = Math.max(0, focusedIndex * rowHeight - viewPortHeight + rowHeight);
                scrollContainer.scrollTop = scrollTop;
            }
        }
    }

    private readonly updatePosition = () => {
        const scrollContainer = this.scrollContainer.current;
        const bottomOffsetRow = this.bottomOffsetRow.current;
        const topOffsetRow = this.topOffsetRow.current;
        if (scrollContainer != undefined && bottomOffsetRow != undefined && topOffsetRow != undefined) {
            const { rowHeight, data } = this.props;
            const height = rowHeight * data.length;
            const scrollTop = scrollContainer.scrollTop;
            const renderRange = this.getRowRangeToRender();
            const topOffset = renderRange.from * rowHeight;
            const bottomOffset = height - renderRange.to * rowHeight;
            bottomOffsetRow.style.height = `${bottomOffset}px`;
            topOffsetRow.style.height = `${topOffset}px`;
            scrollContainer.scrollTop = scrollTop;
            this.forceUpdate(() => {
                scrollContainer.scrollTop = scrollTop;
            });
        }
    };

    private readonly handleScroll = (e: React.SyntheticEvent) => {
        this.updateDebounced(e);
    };

    private getRowsPerScreen(): number {
        const { rowHeight } = this.props;
        const scrollContainer = this.scrollContainer.current;
        if (scrollContainer == undefined) {
            return 1;
        }
        const height = scrollContainer.getBoundingClientRect().height;
        return Math.ceil(height / rowHeight);
    }

    private getVisibleRowRange(): RowRange {
        const { data, rowHeight } = this.props;
        const scrollContainer = this.scrollContainer.current;
        if (scrollContainer == undefined) {
            return {
                from: 0,
                to: 0,
            };
        }
        const scrollTop = scrollContainer.scrollTop;
        const rowsPerScreen = this.getRowsPerScreen();

        const firstVisibleRowIndex = Math.min(
            data.length - rowsPerScreen,
            Math.max(0, Math.floor(scrollTop / rowHeight))
        );
        return {
            from: firstVisibleRowIndex,
            to: Math.min(data.length, firstVisibleRowIndex + rowsPerScreen),
        };
    }

    private getRowRangeToRender(): RowRange {
        const { data } = this.props;
        const visibleRowRange = this.getVisibleRowRange();

        return {
            from: Math.max(0, visibleRowRange.from - additionalRowCountToRender),
            to: Math.min(data.length, visibleRowRange.to + additionalRowCountToRender),
        };
    }
}
