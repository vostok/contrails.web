import * as React from "react";

import { useDebounceCallback } from "../../Commons/Effects";
import { emptyRef } from "../../Commons/TypingHacks";

import { PartialRenderCalculator } from "./PartialRenderCalculator";
import { RowRange } from "./RowRange";
import cn from "./VirtualTable.less";

interface VirtualTableProps<T> {
    data: T[];
    renderHeader: () => React.ReactNode;
    renderRow: (item: T, index: number) => React.ReactNode;
    rowHeight: number;
    headerHeight: number;
    tableClassName?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTableElement>) => void;
}

interface VirtualTableRef<T> {
    scrollIntoView(item: T): void;
}

export function VirtualTableInternal<T>(props: VirtualTableProps<T>, ref: React.Ref<unknown>): JSX.Element {
    const scrollContainer = React.useRef<HTMLDivElement>(emptyRef);
    const [renderRange, setRenderRange] = React.useState<RowRange>({ from: 0, to: 0 });

    function recalculateRowRangeToRender(): void {
        if (scrollContainer.current != undefined) {
            setRenderRange(
                PartialRenderCalculator.getRowRangeToRender(
                    scrollContainer.current.getBoundingClientRect().height,
                    scrollContainer.current.scrollTop,
                    props.data.length,
                    props.rowHeight
                )
            );
        }
    }

    React.useImperativeHandle<unknown, VirtualTableRef<T>>(ref, () => ({
        scrollIntoView: (item: T) => {
            if (scrollContainer.current != undefined) {
                const nextScrollTop = PartialRenderCalculator.getScrollPositionForItem(
                    scrollContainer.current.getBoundingClientRect().height,
                    scrollContainer.current.scrollTop,
                    props.data.length,
                    props.rowHeight,
                    props.data.indexOf(item)
                );
                if (nextScrollTop != undefined) {
                    scrollContainer.current.scrollTop = nextScrollTop;
                }
            }
        },
    }));

    React.useEffect(recalculateRowRangeToRender, [props.data]);

    const handleScroll = useDebounceCallback(recalculateRowRangeToRender, 100, [props.data, props.rowHeight]);

    const totalHeight = props.rowHeight * props.data.length;
    const topOffset = renderRange.from * props.rowHeight;
    const bottomOffset = totalHeight - renderRange.to * props.rowHeight;

    return (
        <div className={cn("root")}>
            <table className={cn("table", props.tableClassName)}>
                <thead>{props.renderHeader()}</thead>
            </table>
            <div
                className={cn("scroll-container")}
                style={{ top: props.headerHeight }}
                onScroll={handleScroll}
                ref={scrollContainer}>
                <div style={{ height: topOffset }} />
                <table tabIndex={-1} className={cn("table", props.tableClassName)} onKeyDown={props.onKeyDown}>
                    <tbody>
                        {props.data
                            .slice(renderRange.from, renderRange.to)
                            .map((x, i) => props.renderRow(x, i + renderRange.from))}
                    </tbody>
                </table>
                <div style={{ height: bottomOffset }} />
            </div>
        </div>
    );
}

// @ts-ignore React.memo typings bug https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087
export const VirtualTable: new <T>(props: VirtualTableProps<T> & React.RefAttributes<T>) => VirtualTableType<
    T
> = React.forwardRef(VirtualTableInternal);

export class VirtualTableType<T> extends React.Component<VirtualTableProps<T>> implements VirtualTableRef<T> {
    public scrollIntoView(item: T): void {
        // noop
    }
}
