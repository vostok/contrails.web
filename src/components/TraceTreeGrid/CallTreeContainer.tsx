import { connect } from "react-redux";

import { strictDefined } from "../../Commons/StrictDefined";
import { SpanNode } from "../../Domain/TraceTree/SpanNode";
import { ContrailsApplicationState } from "../../Store/ContrailsApplicationState";
import { changeFocusedNode } from "../../Store/ContrailsApplicationActions";
import { ContrailsDispatch } from "../../Store/ContrailsDispatch";

import { TraceTreeGrid } from "./TraceTreeGrid";

const mapProps = (state: ContrailsApplicationState) => {
    const viewPort = strictDefined(state.viewPort);

    return {
        filterNodes: (x: SpanNode) =>
            (viewPort.from < x.from && x.from < viewPort.to) ||
            (viewPort.from < x.to && x.to < viewPort.to) ||
            (x.from < viewPort.from && viewPort.to < x.to),
        totalTimeRange: undefined,
        focusedItem: state.focusedSpanNode,
        traceTree: strictDefined(state.traceTree),
    };
};

const mapDispatch = (dispatch: ContrailsDispatch) => ({
    onItemClick: (focusedNode: undefined | SpanNode) => dispatch(changeFocusedNode(focusedNode)),
    onChangeFocusedItem: (focusedNode: undefined | SpanNode) => dispatch(changeFocusedNode(focusedNode)),
});

export const CallTreeContainer = connect(
    mapProps,
    mapDispatch
)(TraceTreeGrid);
