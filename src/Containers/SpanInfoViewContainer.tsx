import { connect } from "react-redux";

import { strictDefined } from "../Commons/StrictDefined";
import { SpanInfoView } from "../Components/SpanInfoView/SpanInfoView";
import { ContrailsApplicationState } from "../Store/ContrailsApplicationState";

const mapProps = (state: ContrailsApplicationState) => ({
    root: strictDefined(state.currentTraceSubtree),
    span: state.focusedSpanNode,
});

export const SpanInfoViewContainer = connect(mapProps)(SpanInfoView);
