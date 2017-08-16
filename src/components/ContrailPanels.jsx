// @flow
import glamurous from "glamorous";

export const ContrailPanelsContainer = glamurous.div({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: "100%",
});

export const ContrailPanelsTop = glamurous.div({
    flex: "0 0 50%",
    boxSizing: "border-box",
    borderBottom: "1px solid #eee",
});

export const ContrailPanelsBottom = glamurous.div({
    flex: "0 0 50%",
    boxSizing: "border-box",
    display: "flex",
});
export const ContrailPanelsBottomLeft = glamurous.div({
    flex: "0 0 70%",
    boxSizing: "border-box",
    borderRight: "1px solid #eee",
});
export const ContrailPanelsBottomRight = glamurous.div({
    flex: "0 0 30%",
    boxSizing: "border-box",
});
