import { connect } from "react-redux";

import { strictDefined } from "../Commons/StrictDefined";
import { TraceTreeGrid } from "../Components/TraceTreeGrid/TraceTreeGrid";
import { SpanNode } from "../Domain/TraceTree/SpanNode";
import { changeFocusedNodeAndUpdateViewPort } from "../Store/ContrailsApplicationActions";
import { ContrailsApplicationState } from "../Store/ContrailsApplicationState";
import { ContrailsDispatch } from "../Store/ContrailsDispatch";

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
