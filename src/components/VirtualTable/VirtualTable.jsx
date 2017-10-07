// @flow
import * as React from "react";
import _ from "lodash";

import cn from "./VirtualTable.less";

type VirtualTableProps<T> = {
    data: T[],
    renderHeader: () => React.Node,
    renderRow: T => React.Node,
    rowHeight: number,
    headerHeight?: number,
    tableClassName?: string,
};

type VirtualTableState = {
    scrollTop: number,
    height: number,
};

export default class VirtualTable<T> extends React.Component<VirtualTableProps<T>, VirtualTableState> {
    props: VirtualTableProps<T>;
    state: VirtualTableState = {
        scrollTop: 0,
        height: 100,
    };
    scrollContainer: ?HTMLElement;
    bottomOffsetRow: ?HTMLElement;
    topOffsetRow: ?HTMLElement;

    updatePosition = () => {
        const { scrollContainer, bottomOffsetRow, topOffsetRow } = this;
        if (scrollContainer != null && bottomOffsetRow != null && topOffsetRow != null) {
            const { rowHeight, data } = this.props;
            const height = rowHeight * data.length;
            const scrollTop = scrollContainer.scrollTop;
            const renderFrom = Math.min(data.length - 40, Math.max(0, Math.round(scrollTop / rowHeight) - 1));

            const topOffset = renderFrom * rowHeight;
            const bottomOffset = height - (renderFrom + 40) * rowHeight;

            bottomOffsetRow.style.height = `${bottomOffset}px`;
            topOffsetRow.style.height = `${topOffset}px`;
            scrollContainer.scrollTop = scrollTop;
            this.setState({}, () => {
                scrollContainer.scrollTop = scrollTop;
            });
        }
    };

    updateDebounce = _.debounce(this.updatePosition, 100, { trailing: true });

    handleScroll = (e: Event<*>) => {
        this.updateDebounce(e);
    };

    componentDidMount() {
        this.updatePosition();
    }

    render(): React.Node {
        const { data, renderRow, renderHeader, rowHeight, tableClassName } = this.props;
        const { scrollContainer } = this;
        const scrollTop = scrollContainer != null ? scrollContainer.scrollTop : 0;
        const renderFrom = Math.min(data.length - 40, Math.max(0, Math.round(scrollTop / rowHeight) - 1));
        const headerHeight = this.props.headerHeight == null ? rowHeight : this.props.headerHeight;

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
                    <table className={cn("table", tableClassName)}>
                        <tbody>
                            <tr>
                                <td ref={x => (this.topOffsetRow = x)} />
                            </tr>
                            {data.slice(renderFrom, renderFrom + 40).map(renderRow)}
                            <tr>
                                <td ref={x => (this.bottomOffsetRow = x)} />
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
