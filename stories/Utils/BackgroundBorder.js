// @flow
import * as React from "react";

import cn from "./BackgroundBorder.less";

export default function BackgroundBorder({
    children,
    width,
}: {
    children: React.Node,
    width?: number | string,
}): React.Node {
    return (
        <div className={cn("root")}>
            <div className={cn("content")} style={{ width: width }}>
                <div className={cn("content-wrapper")}>{children}</div>
            </div>
        </div>
    );
}
