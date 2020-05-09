import * as React from "react";

import { useComponentWidth } from "../../Commons/Hooks/UseComponentWidth";
import { Colors } from "../../Domain/Colors";
import { DateTimeUtils } from "../../Domain/DateTimeUtils";
import { TimeRange } from "../../Domain/TimeRange";
import { SpanNode } from "../../Domain/TraceTree/SpanNode";

import cn from "./SpanNodeTimeLine.less";

interface SpanNodeTimeLineProps {
    node: SpanNode;
    totalTimeRange: TimeRange;
    highlighted: boolean;
}

export function SpanNodeTimeLine({ node, totalTimeRange, highlighted }: SpanNodeTimeLineProps): JSX.Element {
    const [width, container] = useComponentWidth<HTMLDivElement>(0);

    const timeRangeDuration = totalTimeRange.to - totalTimeRange.from;
    const nodeDuration = node.to - node.from;

    const nodeLeftInPixels = Math.round(((node.from - totalTimeRange.from) / timeRangeDuration) * width);
    const nodeWidthInPixels = Math.max(4, (nodeDuration / timeRangeDuration) * width);

    const leftOversize = Math.abs(Math.min(0, nodeLeftInPixels));
    const nodeLeftPosition = nodeLeftInPixels + leftOversize;
    const nodeWidthPosition = nodeWidthInPixels - leftOversize;

    return (
        <div ref={container} className={cn("container")}>
            <div
                className={cn("time-span", { faded: !highlighted })}
                style={{
                    backgroundColor: Colors[node.status].background,
                    width: nodeWidthPosition,
                    left: nodeLeftPosition,
                }}>
                {renderSpanInfo(nodeLeftPosition, width, nodeWidthPosition, node)}
            </div>
        </div>
    );
}

function getDurationPosition(
    nodeLeftPosition: number,
    componentWidth: number,
    nodeRightPosition: number
): "left" | "right" | "inside" {
    if (nodeLeftPosition < 40 && componentWidth - (nodeLeftPosition + nodeRightPosition) < 40) {
        return "inside";
    } else if (nodeLeftPosition >= 40) {
        return "left";
    } else if (nodeLeftPosition < 40 && componentWidth - (nodeLeftPosition + nodeRightPosition) >= 40) {
        return "right";
    }
    return "inside";
}

function getOperationNamePosition(
    nodeLeftPosition: number,
    componentWidth: number,
    nodeRightPosition: number
): "left" | "right" | "inside" {
    const leftSpaceWidth = nodeLeftPosition;
    const rightSpaceWidth = componentWidth - (nodeLeftPosition + nodeRightPosition);
    const insideSpaceWidth = nodeRightPosition;
    if (insideSpaceWidth > leftSpaceWidth && insideSpaceWidth > rightSpaceWidth) {
        return "inside";
    }
    if (leftSpaceWidth > insideSpaceWidth && leftSpaceWidth > rightSpaceWidth) {
        return "left";
    }
    if (rightSpaceWidth > insideSpaceWidth && rightSpaceWidth > leftSpaceWidth) {
        return "right";
    }
    return "right";
}

function renderSpanInfo(
    nodeLeftPosition: number,
    componentWidth: number,
    nodeRightPosition: number,
    node: SpanNode
): JSX.Element {
    const durationFormatted = DateTimeUtils.formatDurationTicks(
        DateTimeUtils.difference(node.source.EndTimestamp, node.source.BeginTimestamp)
    );

    const durationPosition = getDurationPosition(nodeLeftPosition, componentWidth, nodeRightPosition);
    const operationPosition = getOperationNamePosition(nodeLeftPosition, componentWidth, nodeRightPosition);
    switch (durationPosition) {
        case "left":
            switch (operationPosition) {
                case "left":
                    return (
                        <span className={cn("duration", "left")}>
                            <span className={cn("inner")}>
                                <span className={cn("operation-name-inner")}>{node.source.OperationName}</span>
                                {durationFormatted}
                            </span>
                        </span>
                    );
                case "right":
                    return (
                        <>
                            <span className={cn("duration", "left")}>
                                <span className={cn("inner")}>{durationFormatted}</span>
                            </span>
                            <span className={cn("duration", "right")}>
                                <span className={cn("inner")}>{node.source.OperationName}</span>
                            </span>
                        </>
                    );
                case "inside":
                    return (
                        <>
                            <span className={cn("duration", "left")}>
                                <span className={cn("inner")}>{durationFormatted}</span>
                            </span>
                            <span className={cn("duration", "inside")}>
                                <span className={cn("inner")}>{node.source.OperationName}</span>
                            </span>
                        </>
                    );
                default:
                    return (
                        <span className={cn("duration", "left")}>
                            <span className={cn("inner")}>{durationFormatted}</span>
                        </span>
                    );
            }
        case "right":
            switch (operationPosition) {
                case "left":
                    return (
                        <span className={cn("duration", "right")}>
                            <span className={cn("inner")}>{durationFormatted}</span>
                        </span>
                    );
                case "right":
                    return (
                        <span className={cn("duration", "right")}>
                            <span className={cn("inner")}>
                                {durationFormatted}
                                <span className={cn("operation-name-inner")}>{node.source.OperationName}</span>
                            </span>
                        </span>
                    );
                case "inside":
                    return (
                        <>
                            <span className={cn("duration", "inside")}>
                                <span className={cn("inner")}>{node.source.OperationName}</span>
                            </span>
                            <span className={cn("duration", "right")}>
                                <span className={cn("inner")}>{durationFormatted}</span>
                            </span>
                        </>
                    );
                default:
                    return (
                        <span className={cn("duration", "right")}>
                            <span className={cn("inner")}>{durationFormatted}</span>
                        </span>
                    );
            }
        case "inside":
            return (
                <span className={cn("duration", "inside")}>
                    <span className={cn("inner")}>
                        {durationFormatted}
                        <span className={cn("operation-name-inner")}>{node.source.OperationName}</span>
                    </span>
                </span>
            );
        default:
            return <span />;
    }
}
