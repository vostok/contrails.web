import * as React from "react";

import cn from "./ContrailPanels.less";

interface ContainerProps {
    className?: string;
    children: React.ReactNode;
}

export function ContrailPanelsContainer(props: ContainerProps): JSX.Element {
    return <div className={cn("contrail-panels-container", props.className)}>{props.children}</div>;
}

export function ContrailPanelsTop(props: ContainerProps): JSX.Element {
    return <div className={cn("contrail-panels-top", props.className)}>{props.children}</div>;
}

export function ContrailPanelsBottom(props: ContainerProps): JSX.Element {
    return <div className={cn("contrail-panels-bottom", props.className)}>{props.children}</div>;
}

export function ContrailPanelsBottomLeft(props: ContainerProps): JSX.Element {
    return <div className={cn("contrail-panels-bottom-left", props.className)}>{props.children}</div>;
}

export function ContrailPanelsBottomRight({ children, className }: ContainerProps): JSX.Element {
    return <div className={cn("contrail-panels-bottom-right", className)}>{children}</div>;
}
