import { connect } from "react-redux";

import { strictDefined } from "../../Commons/StrictDefined";
import { SpanNode } from "../../Domain/TraceTree/SpanNode";
import { ContrailsApplicationState } from "../../Store/ContrailsApplicationState";
import { changeFocusedNodeAndUpdateViewPort } from "../../Store/ContrailsApplicationActions";
import { ContrailsDispatch } from "../../Store/ContrailsDispatch";

import { TraceTreeGrid } from "./TraceTreeGrid";

const mapProps = (state: ContrailsApplicationState) => ({
    totalTimeRange: strictDefined(state.timeRange),
    focusedItem: state.focusedSpanNode,
    traceTree: strictDefined(state.traceTree),
});

const mapDispatch = (dispatch: ContrailsDispatch) => ({
    onItemClick: (focusedNode: SpanNode) => dispatch(changeFocusedNodeAndUpdateViewPort(focusedNode)),
    onChangeFocusedItem: (focusedNode: SpanNode) => dispatch(changeFocusedNodeAndUpdateViewPort(focusedNode)),
});

export const FullCallTreeContainer = connect(
    mapProps,
    mapDispatch
)(TraceTreeGrid);
