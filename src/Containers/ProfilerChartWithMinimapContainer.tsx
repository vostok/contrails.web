import { connect } from "react-redux";

import { strictDefined } from "../Commons/StrictDefined";
import { ProfilerChartWithMinimap } from "../Components/ProfilerChartWithMinimap/ProfilerChartWithMinimap";
import { SpanLineItem } from "../Domain/SpanLines/SpansToLinesArranger";
import { TimeRange } from "../Domain/TimeRange";
import { ActionType } from "../Store/ContrailsApplicationActions";
import { ContrailsApplicationState } from "../Store/ContrailsApplicationState";
import { ContrailsDispatch } from "../Store/ContrailsDispatch";

class ProfilerChartWithMinimapForSpanLineItem extends ProfilerChartWithMinimap<SpanLineItem> {}

const mapProps = (state: ContrailsApplicationState) => ({
    timeRange: strictDefined(state.subtreeTimeRange),
    viewPort: strictDefined(state.viewPort),
});

const mapDispatch = (dispatch: ContrailsDispatch) => ({
    onChangeViewPort: (viewPort: TimeRange) =>
        dispatch({ type: ActionType.ChangeViewPort, payload: { viewPort: viewPort } }),
});

export const ProfilerChartWithMinimapContainer = connect(
    mapProps,
    mapDispatch
)(ProfilerChartWithMinimapForSpanLineItem);
