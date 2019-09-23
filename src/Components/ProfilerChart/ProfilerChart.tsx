import * as React from "react";

import { InvalidProgramStateError } from "../../Commons/Errors";
import { emptyRef, runAsyncAction } from "../../Commons/TypingHacks";
import { TimeRange } from "../../Domain/TimeRange";

import { defaultCustomDrawHandler } from "./Internal/DefaultCustomDrawHandler";
import {
    ItemDrawContext,
    lineGap,
    lineHeight,
    ProfilerChartDrawer,
    ProfilerData,
} from "./Internal/ProfilerChartDrawer";

export interface ProfilerChartProps<TItem extends TimeRange> {
    spanLines: ProfilerData<TItem>;
    width: number;
    viewPort: TimeRange;
    onItemClick?: (item: TItem, lineIndex: number) => void;
    selectedItems?: TItem[];
    onCustomDrawItem?: (context: CanvasRenderingContext2D, item: TItem, itemDrawContext: ItemDrawContext) => void;
}

export function ProfilerChart<TItem extends TimeRange>(props: ProfilerChartProps<TItem>): JSX.Element {
    const canvas = React.useRef<null | HTMLCanvasElement>(emptyRef);
    const drawer = React.useRef<null | ProfilerChartDrawer<TItem>>(emptyRef);

    React.useEffect(() => {
        if (canvas.current == undefined) {
            throw new InvalidProgramStateError();
        }
        drawer.current = new ProfilerChartDrawer(
            canvas.current,
            props.spanLines,
            props.width,
            props.viewPort,
            props.onCustomDrawItem || defaultCustomDrawHandler
        );
    }, []);

    React.useEffect(() => {
        if (drawer.current != undefined) {
            drawer.current.updateViewPort(props.width, props.viewPort);
        }
    }, [props.width, props.viewPort]);

    React.useEffect(() => {
        if (drawer.current != undefined) {
            drawer.current.setSelectedItems(props.selectedItems);
        }
    }, [props.selectedItems]);

    React.useEffect(() => {
        runAsyncAction(async () => {
            if (drawer.current != undefined) {
                await drawer.current.drawData();
            }
        });
    }, [props.width, props.viewPort, props.selectedItems]);

    const handleMouseClick = React.useCallback(
        (event: React.MouseEvent<HTMLCanvasElement>) => {
            if (props.onItemClick != undefined && drawer.current != undefined) {
                const itemAtCursor = drawer.current.getItemAtCursor(event);
                if (itemAtCursor != undefined) {
                    props.onItemClick(itemAtCursor.item, itemAtCursor.lineIndex);
                }
            }
        },
        [props.onItemClick]
    );

    const handleMouseLeave = React.useCallback(() => {
        if (drawer.current != undefined) {
            drawer.current.handleChangeHoveredItem(undefined);
        }
    }, []);

    const handleMouseMove = React.useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (drawer.current != undefined) {
            drawer.current.handleChangeHoveredItem(drawer.current.getItemAtCursor(event));
        }
    }, []);

    return (
        <canvas
            width={props.width}
            ref={canvas}
            onClick={handleMouseClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            height={(lineHeight + lineGap) * props.spanLines.lines.length}
        />
    );
}
