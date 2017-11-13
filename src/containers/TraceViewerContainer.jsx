// @flow
import * as React from "react";
import { Spinner } from "ui";
import { withRouter } from "react-router";
import type { IBrowserHistory } from "react-router";
import { Helmet } from "react-helmet";
import takeLastAndRejectPrevious from "commons/TakeLastAndRejectPrevious";

import ContrailsLayout from "../components/ContrailsLayout/ContrailsLayout";
import TraceIdInput from "../components/TraceIdInput/TraceIdInput";
import type { TraceInfo } from "../Domain/TraceInfo";
import { withContrailsApi } from "../Domain/ContrailsApiInjection";
import type { IContrailsApi } from "../Domain/IContrailsApi";
import TraceViewer from "../components/TraceViewer/TraceViewer";
import { type IDataExtractor, LogsearchDataExtractor, VostokDataExtractor } from "../Domain/IDataExtractor";

import cn from "./TraceViewerContainer.less";

const dataExtractor: IDataExtractor =
    process.env.API_TARGET === "logsearch" ? new LogsearchDataExtractor() : new VostokDataExtractor();

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
        console.log(this.props.traceIdPrefix, nextProps.traceIdPrefix)
        if (this.props.traceIdPrefix !== nextProps.traceIdPrefix) {
            this.updateTrace(nextProps.traceIdPrefix);
        }
    }

    componentWillMount() {
        this.updateTrace(this.props.traceIdPrefix);
    }

    setServerError() {
        this.setState({
            error: true,
            errorTitle: "500",
            errorMessage: "Кажется что-то пошло не так :-(",
        });
    }

    setTraceNotFound() {
        this.setState({
            error: true,
            errorTitle: "404",
            errorMessage: "Трассировок не найдено.",
        });
    }

    setUnexpectedError() {
        this.setState({
            error: true,
            errorTitle: "Упс :-(",
            errorMessage: "Произошла непредвиденная ошибка",
        });
    }

    getTrace = takeLastAndRejectPrevious((traceIdPrefix: string): Promise<TraceInfo> =>
        this.props.contrailsApi.getTrace(traceIdPrefix)
    );

    async updateTrace(traceIdPrefix: string): Promise<void> {
        this.setState({ error: false, traceInfo: null, loading: true, currentTraceIdPrefix: traceIdPrefix });
        try {
            const traceInfo = await this.getTrace(traceIdPrefix);
            if (traceInfo.Spans.length === 0) {
                this.setTraceNotFound();
                return;
            }
            this.setState({ traceInfo: traceInfo });
        } catch (e) {
            console.error(e);
            if (e instanceof Error) {
                if (e.message === "500") {
                    this.setServerError();
                    return;
                }
                if (e.message === "404") {
                    this.setTraceNotFound();
                    return;
                }
            }
            this.setUnexpectedError();
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
                    <h1>{errorTitle}</h1>
                    <div className={cn("message")}>{errorMessage}</div>
                </div>
            </div>
        );
    }

    renderLoader(): React.Node {
        return (
            <div className={cn("loader-container")}>
                <div className={cn("message")}>
                    <Spinner type="mini" caption="Loading..." />
                </div>
            </div>
        );
    }

    render(): React.Node {
        const { traceIdPrefix } = this.props;
        const { loading, traceInfo, error } = this.state;
        return (
            <ContrailsLayout header={this.renderHeaderContent()}>
                <Helmet>
                    <title>{`Trace ${traceIdPrefix}`}</title>
                </Helmet>
                {loading && this.renderLoader()}
                {error && this.renderErrorMessage()}
                {traceInfo != null && <TraceViewer dataExtractor={dataExtractor} traceInfo={traceInfo} />}
            </ContrailsLayout>
        );
    }
}

// если не кастовать, то не работает :-(
export default (withRouter(withContrailsApi(TraceViewerContainer)): React.ComponentType<{ traceIdPrefix: string }>);
