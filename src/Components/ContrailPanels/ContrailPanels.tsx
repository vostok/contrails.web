import * as React from "react";

import cn from "./ContrailPanels.less";

interface ContainerProps {
    children: React.ReactNode;
}

export class ContrailPanelsContainer extends React.Component<ContainerProps> {
    public render(): React.ReactNode {
        return <div className={cn("contrail-panels-container")}>{this.props.children}</div>;
    }
}

export class ContrailPanelsTop extends React.Component<ContainerProps> {
    public render(): React.ReactNode {
        return <div className={cn("contrail-panels-top")}>{this.props.children}</div>;
    }
}

export class ContrailPanelsBottom extends React.Component<ContainerProps> {
    public render(): React.ReactNode {
        return <div className={cn("contrail-panels-bottom")}>{this.props.children}</div>;
    }
}

export function ContrailPanelsFooter({ children }: ContainerProps): JSX.Element {
    return <div className={cn("contrail-panels-footer")}>{children}</div>;
}

export class ContrailPanelsBottomLeft extends React.Component<ContainerProps> {
    public render(): React.ReactNode {
        return <div className={cn("contrail-panels-bottom-left")}>{this.props.children}</div>;
    }
}

export function ContrailPanelsBottomRight({ children }: ContainerProps): JSX.Element {
    return <div className={cn("contrail-panels-bottom-right")}>{children}</div>;
}
