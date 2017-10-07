// @flow
import * as React from "react";
import _ from "lodash";

import cn from "./VirtualTable.less";

type VirtualTableProps<T> = {
    data: T[],
    renderHeader: () => React.Node,
    renderRow: T => React.Node,
    rowHeight: number,
    headerHeight: number,
    tableClassName?: string,
    onKeyDown?: (SyntheticKeyboardEvent<HTMLTableElement>) => void,
};

type VirtualTableState = {};

type RowRange = {
    from: number,
    to: number,
};

const additionalRowCountToRender = 40;

export default class VirtualTable<T> extends React.Component<VirtualTableProps<T>, VirtualTableState> {
    props: VirtualTableProps<T>;
    state: VirtualTableState = {};
    scrollContainer: ?HTMLElement;
    bottomOffsetRow: ?HTMLElement;
    topOffsetRow: ?HTMLElement;

    scrollIntoView(item: T) {
        const { scrollContainer } = this;
        if (scrollContainer != null) {
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

    shouldComponentUpdate(nextProps: VirtualTableProps<T>): boolean {
        return (
            nextProps.data !== this.props.data ||
            nextProps.renderHeader !== this.props.renderHeader ||
            nextProps.renderRow !== this.props.renderRow ||
            nextProps.rowHeight !== this.props.rowHeight ||
            nextProps.headerHeight !== this.props.headerHeight ||
            nextProps.tableClassName !== this.props.tableClassName ||
            nextProps.onKeyDown !== this.props.onKeyDown
        );
    }

    updatePosition = () => {
        const { scrollContainer, bottomOffsetRow, topOffsetRow } = this;
        if (scrollContainer != null && bottomOffsetRow != null && topOffsetRow != null) {
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

    updateDebounced = _.debounce(this.updatePosition, 100);

    handleScroll = (e: Event<*>) => {
        this.updateDebounced(e);
    };

    componentDidMount() {
        this.updatePosition();
    }

    componentDidUpdate(prevProps: VirtualTableProps<T>) {
        if (this.props.data !== prevProps.data) {
            this.updatePosition();
        }
    }

    getRowsPerScreen(): number {
        const { rowHeight } = this.props;
        const { scrollContainer } = this;
        if (scrollContainer == null) {
            return 1;
        }
        const height = scrollContainer.getBoundingClientRect().height;
        return Math.ceil(height / rowHeight);
    }

    getVisibleRowRange(): RowRange {
        const { data, rowHeight } = this.props;
        const { scrollContainer } = this;
        if (scrollContainer == null) {
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

    getRowRangeToRender(): RowRange {
        const { data } = this.props;
        const visibleRowRange = this.getVisibleRowRange();

        return {
            from: Math.max(0, visibleRowRange.from - additionalRowCountToRender),
            to: Math.min(data.length, visibleRowRange.to + additionalRowCountToRender),
        };
    }

    render(): React.Node {
        const { data, renderRow, headerHeight, rowHeight, renderHeader, tableClassName, onKeyDown } = this.props;
        const renderRange = this.getRowRangeToRender();
        const height = rowHeight * data.length;
        const topOffset = renderRange.from * rowHeight;
        const bottomOffset = height - renderRange.to * rowHeight;

        return (
            <div className={cn("root")}>
                <table className={cn("table", tableClassName)}>
                    <thead>
                        {renderHeader()}
                    </thead>
                </table>
                <div
                    className={cn("scroll-container")}
                    style={{ top: headerHeight }}
                    onScroll={this.handleScroll}
                    ref={x => (this.scrollContainer = x)}>
                    <div ref={x => (this.topOffsetRow = x)} style={{ height: topOffset }} />
                    <table className={cn("table", tableClassName)} onKeyDown={onKeyDown}>
                        <tbody>
                            {data.slice(renderRange.from, renderRange.to).map(renderRow)}
                        </tbody>
                    </table>
                    <div ref={x => (this.bottomOffsetRow = x)} style={{ bottomOffset: bottomOffset }} />
                </div>
            </div>
        );
    }
}
