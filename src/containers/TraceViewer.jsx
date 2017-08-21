// @flow
import * as React from "react";

import ContrailsLayout from "../components/ContrailsLayout";
import type { TraceInfo } from "../Domain/TraceInfo";
import { withContrailsApi } from "../Domain/ContrailsApiInjection";
import type { IContrailsApi } from "../Domain/IContrailsApi";

type ContrailsApplicationProps = {
    traceIdPrefix: string,
    contrailsApi: IContrailsApi,
};

type ContrailsApplicationState = {
    loading: boolean,
    traceInfo: ?TraceInfo,
};

export class ContrailsApplication extends React.Component<ContrailsApplicationProps, ContrailsApplicationState> {
    props: ContrailsApplicationProps;
    state: ContrailsApplicationState = {
        loading: false,
        traceInfo: null,
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
        this.setState({ loading: true });
        const tracesInfos = await contrailsApi.getTrace(traceIdPrefix);
        if (tracesInfos.length > 0) {
            this.setState({ traceInfo: tracesInfos[0] });
        }
        this.setState({ loading: false });
    }

    render(): React.Node {
        const { loading, traceInfo } = this.state;
        return (
            <ContrailsLayout>
                {loading && <span>Loading...</span>}
                {traceInfo != null &&
                    <pre>
                        {JSON.stringify(traceInfo, null, "  ")}
                    </pre>}
            </ContrailsLayout>
        );
    }
}

export default withContrailsApi(ContrailsApplication);
