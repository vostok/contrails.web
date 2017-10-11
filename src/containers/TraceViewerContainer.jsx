// @flow
import * as React from "react";
import { withRouter } from "react-router";
import type { IBrowserHistory } from "react-router";

import ContrailsLayout from "../components/ContrailsLayout/ContrailsLayout";
import TraceIdInput from "../components/TraceIdInput/TraceIdInput";
import type { TraceInfo } from "../Domain/TraceInfo";
import { withContrailsApi } from "../Domain/ContrailsApiInjection";
import type { IContrailsApi } from "../Domain/IContrailsApi";
import TraceViewer from "../components/TraceViewer/TraceViewer";

import cn from "./TraceViewerContainer.less";

type ContrailsApplicationProps = {
    traceIdPrefix: string,
    contrailsApi: IContrailsApi,
    history: IBrowserHistory,
};

type ContrailsApplicationState = {
    error: boolean,
    errorTitle: ?string,
    errorMessage: ?string,
    loading: boolean,
    traceInfo: ?TraceInfo,
    currentTraceIdPrefix: string,
};

export class TraceViewerContainer extends React.Component<ContrailsApplicationProps, ContrailsApplicationState> {
    props: ContrailsApplicationProps;
    state: ContrailsApplicationState = {
        loading: false,
        traceInfo: null,
        currentTraceIdPrefix: "",
        error: false,
        errorTitle: null,
        errorMessage: null,
    };

    componentWillReceiveProps(nextProps: ContrailsApplicationProps) {
        if (this.props.traceIdPrefix !== nextProps.traceIdPrefix) {
            this.updateTrace(nextProps.traceIdPrefix);
        }
    }

    componentWillMount() {
        this.updateTrace(this.props.traceIdPrefix);
    }

    async updateTrace(traceIdPrefix: string): Promise<void> {
        const { contrailsApi } = this.props;
        this.setState({ error: false, traceInfo: null, loading: true, currentTraceIdPrefix: traceIdPrefix });
        try {
            const traceInfo = await contrailsApi.getTrace(traceIdPrefix);
            this.setState({ traceInfo: traceInfo });
        } catch (e) {
            if (e instanceof Error) {
                if (e.message === "500") {
                    this.setState({
                        error: true,
                        errorTitle: "500",
                        errorMessage: "Кажется что-то пошло не так :-(",
                    });
                    return;
                }
                if (e.message === "404") {
                    this.setState({
                        error: true,
                        errorTitle: "404",
                        errorMessage: "Трассировок не найдено.",
                    });
                    return;
                }
            }
            this.setState({
                error: true,
                errorTitle: "Упс :-(",
                errorMessage: "Произошла непредвиденная ошибка",
            });
        } finally {
            this.setState({ loading: false });
        }
    }

    renderHeaderContent(): React.Node {
        const { history } = this.props;
        const { currentTraceIdPrefix } = this.state;
        return (
            <TraceIdInput
                value={currentTraceIdPrefix}
                onChange={value => this.setState({ currentTraceIdPrefix: value })}
                onOpenTrace={() => history.push(`/${currentTraceIdPrefix}`)}
            />
        );
    }

    renderErrorMessage(): React.Node {
        const { errorTitle, errorMessage } = this.state;
        return (
            <div className={cn("error-container")}>
                <div>
                    <h1>
                        {errorTitle}
                    </h1>
                    <div className={cn("message")}>
                        {errorMessage}
                    </div>
                </div>
            </div>
        );
    }

    render(): React.Node {
        const { loading, traceInfo, error } = this.state;
        return (
            <ContrailsLayout header={this.renderHeaderContent()}>
                {loading && <span>Loading...</span>}
                {error && this.renderErrorMessage()}
                {traceInfo != null && <TraceViewer traceInfo={traceInfo} />}
            </ContrailsLayout>
        );
    }
}

// если не кастовать, то не работает :-(
export default (withRouter(withContrailsApi(TraceViewerContainer)): React.ComponentType<{ traceIdPrefix: string }>);
