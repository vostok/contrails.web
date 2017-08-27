// @flow
/* eslint-disable */
import * as React from 'react';
import { Button, Input } from 'ui';
import { withRouter } from 'react-router';
import type { IBrowserHistory } from 'react-router';

import ContrailsLayout from '../components/ContrailsLayout/ContrailsLayout';
import type { TraceInfo } from '../Domain/TraceInfo';
import { withContrailsApi } from '../Domain/ContrailsApiInjection';
import type { IContrailsApi } from '../Domain/IContrailsApi';
import TraceViewer from '../components/TraceViewer/TraceViewer';

import cn from './TraceViewerContainer.less';

type ContrailsApplicationProps = {
    traceIdPrefix: string,
    contrailsApi: IContrailsApi,
    history: IBrowserHistory,
};

type ContrailsApplicationState = {
    loading: boolean,
    traceInfo: ?TraceInfo,
    currentTraceIdPrefix: string,
};

export class TraceViewerContainer extends React.Component<ContrailsApplicationProps, ContrailsApplicationState> {
    props: ContrailsApplicationProps;
    state: ContrailsApplicationState = {
        loading: false,
        traceInfo: null,
        currentTraceIdPrefix: '',
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
        this.setState({ traceInfo: null, loading: true, currentTraceIdPrefix: traceIdPrefix });
        const tracesInfos = await contrailsApi.getTrace(traceIdPrefix);
        if (tracesInfos.length > 0) {
            this.setState({ traceInfo: tracesInfos[0] });
        }
        this.setState({ loading: false });
    }

    handleOpenTrace = () => {
        const { history } = this.props;
        const { currentTraceIdPrefix } = this.state;
        history.push(`/${currentTraceIdPrefix}`);
    };

    renderHeaderContent(): React.Node {
        const { currentTraceIdPrefix } = this.state;
        return (
            <div>
                <Input
                    placeholder="Введите TraceId"
                    autoFocus
                    width={500}
                    value={currentTraceIdPrefix}
                    onChange={(e, value) => this.setState({ currentTraceIdPrefix: value })}
                />
                <span className={cn('gap')} />
                <Button use="success" onClick={this.handleOpenTrace}>
                    Открыть
                </Button>
            </div>
        );
    }

    render(): React.Node {
        const { loading, traceInfo } = this.state;
        return (
            <ContrailsLayout header={this.renderHeaderContent()}>
                {loading && <span>Loading...</span>}
                {traceInfo != null && <TraceViewer traceInfo={traceInfo} />}
            </ContrailsLayout>
        );
    }
}

// если не кастовать, то не работает :-(
export default (withRouter(withContrailsApi(TraceViewerContainer)): React.ComponentType<{ traceIdPrefix: string }>);
