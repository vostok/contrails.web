// @flow
import glamurous from "glamorous";

export const ContrailPanelsContainer = glamurous.div({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "column",
    flexShrink: 0,
    flexGrow: 1,
});

export const ContrailPanelsTop = glamurous.div({
    position: "absolute",
    top: 0,
    bottom: "50%",
    left: 0,
    right: 0,
    boxSizing: "border-box",
    borderBottom: "1px solid #888",
});

export const ContrailPanelsBottom = glamurous.div({
    position: "absolute",
    bottom: 0,
    top: "50%",
    left: 0,
    right: 0,
    boxSizing: "border-box",
    display: "flex",
});

export const ContrailPanelsFooter = glamurous.div({
    flex: "0 1 0px",
    boxSizing: "border-box",
});

export const ContrailPanelsBottomLeft = glamurous.div({
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "70%",
    boxSizing: "border-box",
    borderRight: "1px solid #eee",
});

export const ContrailPanelsBottomRight = glamurous.div({
    overflowY: "scroll",
    position: "absolute",
    top: 0,
    left: "70%",
    bottom: 0,
    right: 0,
    boxSizing: "border-box",
});
