import { connect } from "react-redux";

import { strictDefined } from "../Commons/StrictDefined";
import { TraceTreeGrid } from "../Components/TraceTreeGrid/TraceTreeGrid";
import { SpanNode } from "../Domain/TraceTree/SpanNode";
import { changeFocusedNode } from "../Store/ContrailsApplicationActions";
import { ContrailsApplicationState } from "../Store/ContrailsApplicationState";
import { ContrailsDispatch } from "../Store/ContrailsDispatch";
import { TimeRangeUtils } from "../Store/TimeRangeUtils";

const mapProps = (state: ContrailsApplicationState) => ({
    filterNodes: (x: SpanNode) => TimeRangeUtils.isItemIntersectsViewPort(strictDefined(state.viewPort), x),
    totalTimeRange: undefined,
    focusedItem: state.focusedSpanNode,
    traceTree: strictDefined(state.currentTraceSubtree),
});

const mapDispatch = (dispatch: ContrailsDispatch) => ({
    onItemClick: (focusedNode: undefined | SpanNode) => dispatch(changeFocusedNode(focusedNode)),
    onChangeFocusedItem: (focusedNode: undefined | SpanNode) => dispatch(changeFocusedNode(focusedNode)),
});

export const CallTreeContainer = connect(mapProps, mapDispatch)(TraceTreeGrid);
