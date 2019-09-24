import * as React from "react";

import { LayoutKind } from "../../Containers/LayoutKind/LayoutKind";

import cn from "./LayoutKindSelect.less";

interface LayoutKindSelectProps {
    value: LayoutKind;
    onChange: (value: LayoutKind) => void;
}

export function LayoutKindSelect({ value, onChange }: LayoutKindSelectProps): JSX.Element {
    return (
        <span className={cn("root")}>
            <button
                className={cn("chart-with-minimap-and-tree", {
                    selected: value === LayoutKind.ChartWithMinimapAndTree,
                })}
                onClick={() => {
                    if (value !== LayoutKind.ChartWithMinimapAndTree) {
                        onChange(LayoutKind.ChartWithMinimapAndTree);
                    }
                }}
            />
            <button
                className={cn("minimap-and-tree", { selected: value === LayoutKind.MinimapAndTree })}
                onClick={() => {
                    if (value !== LayoutKind.MinimapAndTree) {
                        onChange(LayoutKind.MinimapAndTree);
                    }
                }}
            />
        </span>
    );
}
