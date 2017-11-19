// @flow
/* eslint-disable react/no-multi-comp */
import * as React from "react";

import cn from "./ContrailPanels.less";

export class ContrailPanelsContainer extends React.Component<{ children: React.Node }> {
    props: { children: React.Node };

    render(): React.Node {
        return <div className={cn("contrail-panels-container")}>{this.props.children}</div>;
    }
}

export class ContrailPanelsTop extends React.Component<{ children: React.Node }> {
    props: { children: React.Node };

    render(): React.Node {
        return <div className={cn("contrail-panels-top")}>{this.props.children}</div>;
    }
}

export class ContrailPanelsBottom extends React.Component<{ children: React.Node }> {
    props: { children: React.Node };

    render(): React.Node {
        return <div className={cn("contrail-panels-bottom")}>{this.props.children}</div>;
    }
}

export function ContrailPanelsFooter({ children }: { children: React.Node }): React.Node {
    return <div className={cn("contrail-panels-footer")}>{children}</div>;
}

export class ContrailPanelsBottomLeft extends React.Component<{ children: React.Node }> {
    props: { children: React.Node };

    render(): React.Node {
        return <div className={cn("contrail-panels-bottom-left")}>{this.props.children}</div>;
    }
}

export function ContrailPanelsBottomRight({ children }: { children: React.Node }): React.Node {
    return <div className={cn("contrail-panels-bottom-right")}>{children}</div>;
}
