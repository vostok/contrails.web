// @flow
import * as React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";

import cn from "./VirtualTable.less";

type VirtualTableProps<T> = {
    data: T[],
    renderHeader: () => React.Node,
    renderRow: T => React.Node,
    rowHeight: number,
};

type VirtualTableState<T> = {
    scrollTop: number,
    height: number,
};

export default class VirtualTable<T> extends React.Component<VirtualTableProps<T>, *> {
    props: VirtualTableProps<T>;
    state: VirtualTableState<T> = {
        scrollTop: 0,
        height: 100,
    };
    scrollContainer: ?HTMLElement;

    update = _.debounce((e) => {
        const { rowHeight, data } = this.props;
        const height = rowHeight * data.length;
        const scrollTop = this.scrollContainer.scrollTop;
        const renderFrom = Math.min(data.length - 40, Math.max(0, Math.round(scrollTop / rowHeight) - 1));

        const topOffset = renderFrom * rowHeight;
        const bottomOffset = height - (renderFrom + 40) * rowHeight;
        this.bottomOffsetRow.style.height = `${bottomOffset}px`;
        this.topOffsetRow.style.height = `${topOffset}px`;
        this.scrollContainer.scrollTop = scrollTop;
        this.setState({
            scrollTop: this.scrollContainer.scrollTop,
        });

    }, 100, { trailing: true });

    handleScroll = (e: Event<*>) => {
        const { rowHeight, data } = this.props;
        const height = rowHeight * data.length;
        this.update(e);
    };

    componentDidMount() {
        this.setState({
            scrollTop: this.scrollContainer.scrollTop,
        });
    }

    render(): React.Node {
        const { data, renderRow, renderHeader, rowHeight } = this.props;
        const scrollTop = this.scrollContainer != null ? this.scrollContainer.scrollTop : 0;
        const renderFrom = Math.min(data.length - 40, Math.max(0, Math.round(scrollTop / rowHeight) - 1));
        //const { scrollTop } = this.state;
        return (
            <div className={cn("root")}>
                <table>
                    <thead>
                        {renderHeader()}
                    </thead>
                </table>
                <div
                    className={cn("scroll-container")}
                    onScroll={this.handleScroll}
                    ref={x => (this.scrollContainer = x)}>
                    <table className={cn('table')}>
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
