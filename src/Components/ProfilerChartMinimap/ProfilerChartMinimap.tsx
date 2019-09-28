import * as React from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

import { normalizeWheel } from "../../Domain/NormalizeWheel";
import { TimeRange } from "../../Domain/TimeRange";
import { ViewPortUtils } from "../../Domain/ViewPortUtils";
import { TimeMarkersBackground } from "../TimeMarkersBackground/TimeMarkersBackground";

import { MinimapChartData } from "./MinimapChartData";
import cn from "./ProfilerChartMinimap.less";
import { ProfilerChartMinimapImage } from "./ProfilerChartMinimapImage/ProfilerChartMinimapImage";

interface ProfilerChartMinimapProps {
    timeRange: TimeRange;
    viewPort: TimeRange;
    onChangeViewPort: (x: TimeRange) => void;
    data: MinimapChartData;
    width: number;
}

export function ProfilerChartMinimap(props: ProfilerChartMinimapProps): JSX.Element {
    const { timeRange, viewPort, onChangeViewPort, data, width } = props;

    function toRelativeX(value: number): number {
        return (value * (timeRange.to - timeRange.from)) / width + timeRange.from;
    }

    function toAbsoluteX(value: number): number {
        return ((value - timeRange.from) * width) / (timeRange.to - timeRange.from);
    }

    const handleDragLeftHandle = React.useCallback(
        (e: DraggableEvent, dragInfo: DraggableData) => {
            if (dragInfo.deltaX !== 0) {
                const nextFrom = toRelativeX(dragInfo.x);
                onChangeViewPort({
                    from: ViewPortUtils.clamp(nextFrom, timeRange.from, toRelativeX(toAbsoluteX(viewPort.to) - 10)),
                    to: viewPort.to,
                });
            }
        },
        [onChangeViewPort, width, viewPort, timeRange]
    );

    const handleDragRightHandle = React.useCallback(
        (e: DraggableEvent, dragInfo: DraggableData) => {
            if (dragInfo.deltaX !== 0) {
                const nextTo = toRelativeX(dragInfo.x);
                onChangeViewPort({
                    from: viewPort.from,
                    to: ViewPortUtils.clamp(nextTo, toRelativeX(toAbsoluteX(viewPort.from) + 10), timeRange.to),
                });
            }
        },
        [onChangeViewPort, width, viewPort, timeRange]
    );

    const handleWheel = React.useCallback(
        (event: React.WheelEvent<HTMLDivElement>) => {
            const { spinY } = normalizeWheel(event);
            const containerRect = event.currentTarget.getBoundingClientRect();
            const mouseX = event.clientX - containerRect.left;
            const mouseXRelative = toRelativeX(mouseX);
            const newViewPort = ViewPortUtils.zoom(timeRange, viewPort, spinY, mouseXRelative);
            onChangeViewPort(newViewPort);
        },
        [onChangeViewPort, width, viewPort, timeRange]
    );

    const handleViewPortDrag = React.useCallback(
        (e: DraggableEvent, dragInfo: DraggableData) => {
            const viewPortOffset = toRelativeX(dragInfo.x) - viewPort.from;
            const nextViewPort = ViewPortUtils.offset(timeRange, viewPort, viewPortOffset);
            onChangeViewPort(nextViewPort);
        },
        [onChangeViewPort, width, viewPort, timeRange]
    );

    const leftAbsolute = 0;
    const rightAbsolute = width;

    const viewPortFromAbsolute = toAbsoluteX(viewPort.from);
    const viewPortToAbsolute = toAbsoluteX(viewPort.to);
    const viewPortSizeAbsolute = viewPortToAbsolute - viewPortFromAbsolute;

    return (
        <div className={cn("container")} onWheel={handleWheel}>
            <div style={{ position: "relative", zIndex: 0 }}>
                <div style={{ position: "relative", height: 18 }} />
                <div style={{ position: "relative", zIndex: 2 }}>
                    <ProfilerChartMinimapImage height={100} width={width} data={data} timeRange={timeRange} />
                </div>
                <TimeMarkersBackground
                    timeRange={timeRange}
                    css
                    width={width}
                    viewPort={timeRange}
                    fontSize={10}
                    titleHeight={18}
                />
            </div>
            <div className={cn("left-shadow")} style={{ width: viewPortFromAbsolute }} />
            <div className={cn("right-shadow")} style={{ width: rightAbsolute - viewPortToAbsolute }} />
            <Draggable
                axis="x"
                onDrag={handleViewPortDrag}
                bounds={{
                    top: 0,
                    bottom: 0,
                    left: leftAbsolute,
                    right: rightAbsolute - viewPortSizeAbsolute,
                }}
                position={{ x: viewPortFromAbsolute, y: 0 }}>
                <div className={cn("scroller")} style={{ width: viewPortSizeAbsolute }} />
            </Draggable>
            <Draggable
                axis="x"
                onDrag={handleDragLeftHandle}
                bounds={{
                    top: 0,
                    bottom: 0,
                    left: leftAbsolute,
                    right: viewPortToAbsolute - 10,
                }}
                position={{ x: viewPortFromAbsolute, y: 0 }}>
                <div className={cn("left-handler-container")}>
                    <div className={cn("left-handler")} />
                </div>
            </Draggable>
            <Draggable
                axis="x"
                onDrag={handleDragRightHandle}
                bounds={{
                    top: 0,
                    bottom: 0,
                    left: viewPortFromAbsolute + 10,
                    right: rightAbsolute,
                }}
                position={{ x: viewPortToAbsolute, y: 0 }}>
                <div className={cn("right-handler-container")}>
                    <div className={cn("right-handler")} />
                </div>
            </Draggable>
        </div>
    );
}
