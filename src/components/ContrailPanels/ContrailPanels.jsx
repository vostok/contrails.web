// @flow
import * as React from "react";

import cn from "./ContrailPanels.less";

export function ContrailPanelsContainer({ children }: { children: React.Node }): React.Node {
    return (
        <div className={cn("contrail-panels-container")}>
            {children}
        </div>
    );
}

export function ContrailPanelsTop({ children }: { children: React.Node }): React.Node {
    return (
        <div className={cn("contrail-panels-top")}>
            {children}
        </div>
    );
}

export function ContrailPanelsBottom({ children }: { children: React.Node }): React.Node {
    return (
        <div className={cn("contrail-panels-bottom")}>
            {children}
        </div>
    );
}

export function ContrailPanelsFooter({ children }: { children: React.Node }): React.Node {
    return (
        <div className={cn("contrail-panels-footer")}>
            {children}
        </div>
    );
}

export function ContrailPanelsBottomLeft({ children }: { children: React.Node }): React.Node {
    return (
        <div className={cn("contrail-panels-bottom-left")}>
            {children}
        </div>
    );
}

export function ContrailPanelsBottomRight({ children }: { children: React.Node }): React.Node {
    return (
        <div className={cn("contrail-panels-bottom-right")}>
            {children}
        </div>
    );
}
