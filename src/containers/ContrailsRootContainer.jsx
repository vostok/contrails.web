// @flow
import * as React from "react";
import { withRouter } from "react-router";
import type { IBrowserHistory } from "react-router";

import TraceIdInput from "../components/TraceIdInput/TraceIdInput";
import ContrailsLayout from "../components/ContrailsLayout/ContrailsLayout";

import cn from "./ContrailsRootContainer.less";

type ContrailsRootContainerProps = {
    history: IBrowserHistory,
};

type ContrailsRootContainerState = {
    currentTraceIdPrefix: string,
};

export class ContrailsRootContainer extends React.Component<ContrailsRootContainerProps, ContrailsRootContainerState> {
    props: ContrailsRootContainerProps;
    state: ContrailsRootContainerState = {
        currentTraceIdPrefix: "",
    };

    render(): React.Node {
        const { history } = this.props;
        const { currentTraceIdPrefix } = this.state;

        return (
            <ContrailsLayout>
                <div className={cn("content")}>
                    <TraceIdInput
                        value={currentTraceIdPrefix}
                        onChange={value => this.setState({ currentTraceIdPrefix: value })}
                        onOpenTrace={() => history.push(`/${currentTraceIdPrefix}`)}
                    />
                </div>
            </ContrailsLayout>
        );
    }
}
export default (withRouter(ContrailsRootContainer): React.ComponentType<{}>);
