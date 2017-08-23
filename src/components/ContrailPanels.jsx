// @flow
import glamurous from "glamorous";

export const ContrailPanelsContainer = glamurous.div({
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    flexGrow: 1,
});

export const ContrailPanelsTop = glamurous.div({
    flex: "1 1 1000",
    boxSizing: "border-box",
    borderBottom: "1px solid #eee",
});

export const ContrailPanelsBottom = glamurous.div({
    flex: "1 1 1000",
    boxSizing: "border-box",
    display: "flex",
});

export const ContrailPanelsFooter = glamurous.div({
    flex: "0 1 0px",
    boxSizing: "border-box",
});

export const ContrailPanelsBottomLeft = glamurous.div({
    flex: "0 0 70%",
    boxSizing: "border-box",
    borderRight: "1px solid #eee",
    position: "relative",
});
export const ContrailPanelsBottomRight = glamurous.div({
    flex: "0 0 30%",
    boxSizing: "border-box",
});
