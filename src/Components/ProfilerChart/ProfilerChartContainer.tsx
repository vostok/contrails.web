import { connect } from "react-redux";

import { strictDefined } from "../../Commons/StrictDefined";
import { handleCustomDrawItem } from "../../Domain/ItemDrawer";
import { SpanLineItem } from "../../Domain/SpanLines/SpansToLinesArranger";
import { changeFocusedNode, getSelectedSpanLineItemMemoized } from "../../Store/ContrailsApplicationActions";
import { ContrailsApplicationState } from "../../Store/ContrailsApplicationState";
import { ContrailsDispatch } from "../../Store/ContrailsDispatch";

import { ProfilerChart, ProfilerChartProps } from "./ProfilerChart";

const ProfilerChartSpanLines: (props: ProfilerChartProps<SpanLineItem>) => JSX.Element = ProfilerChart;

const mapProps = (state: ContrailsApplicationState, ownProps: { width: number }) => ({
    viewPort: strictDefined(state.viewPort),
    onCustomDrawItem: handleCustomDrawItem,
    selectedItems: getSelectedSpanLineItemMemoized(strictDefined(state.spanLines), state.focusedSpanNode),
    data: strictDefined(state.spanLines),
});

const mapDispatch = (dispatch: ContrailsDispatch) => ({
    onItemClick: (lineItem: SpanLineItem) => dispatch(changeFocusedNode(lineItem.source)),
});

export const ProfilerChartContainer = connect(
    mapProps,
    mapDispatch
)(ProfilerChartSpanLines);
