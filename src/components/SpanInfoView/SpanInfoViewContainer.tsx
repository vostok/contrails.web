import { connect } from "react-redux";

import { strictDefined } from "../../Commons/StrictDefined";
import { ContrailsApplicationState } from "../../Store/ContrailsApplicationState";

import { SpanInfoView } from "./SpanInfoView";

const mapProps = (state: ContrailsApplicationState) => ({
    root: strictDefined(state.traceTree),
    span: strictDefined(state.focusedSpanNode),
});

export const SpanInfoViewContainer = connect(mapProps)(SpanInfoView);
