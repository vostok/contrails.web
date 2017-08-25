// @flow
import * as React from "react";
import glamorous from "glamorous";
import ReactDom from "react-dom";

import ProfilerChart from "./ProfilerChart/ProfilerChart";
import type { ProfilerData, ProfilerItem, ItemDrawContext } from "./ProfilerChart/ProfilerChart";
import ProfilerChartContainer from "./ProfilerChartContainer";
import ProfilerChartMinimap from "./ProfilerChartMinimap";

type ProfilerChartWithMinimapProps<TItem> = {
    data: ProfilerData<TItem>,
    from: number,
    to: number,
    onItemClick?: TItem => void,
    onCustomDrawItem?: (context: CanvasRenderingContext2D, item: TItem, options: ItemDrawContext) => void,
};

type ProfilerChartWithMinimapState = {
    width: ?number,
    viewPortFrom: ?number,
    xScale: ?number,
};

export default class ProfilerChartWithMinimap<TItem: ProfilerItem> extends React.Component<
    ProfilerChartWithMinimapProps<TItem>,
    ProfilerChartWithMinimapState
> {
    props: ProfilerChartWithMinimapProps<TItem>;
    state: ProfilerChartWithMinimapState = {
        width: null,
        viewPortFrom: null,
        xScale: null,
    };
    container: ?React.ElementRef<*>;

    componentDidUpdate() {
        this.updateWidth();
    }

    componentDidMount() {
        this.updateWidth();
    }

    updateWidth() {
        const container = ReactDom.findDOMNode(this.container);
        if (!(container instanceof HTMLElement)) {
            return;
        }
        const { width } = this.state;
        const newWidth = container.getBoundingClientRect().width;
        if (newWidth !== width) {
            const { viewPortFrom, xScale } = this.state;
            if (viewPortFrom == null && xScale == null) {
                const { from, to } = this.props;
                this.setState({
                    width: newWidth,
                    viewPortFrom: from,
                    xScale: newWidth / (to - from),
                });
            } else {
                this.setState({
                    width: newWidth,
                });
            }
        }
    }

    handleWheel = (event: SyntheticWheelEvent<>) => {
        const { width, xScale, viewPortFrom } = this.state;
        const { from: maxFrom, to: maxTo } = this.props;
        const container = ReactDom.findDOMNode(this.container);
        if (!(container instanceof HTMLElement)) {
            return;
        }

        if (width == null || xScale == null || viewPortFrom == null) {
            return;
        }
        const containerRect = container.getBoundingClientRect();
        const mouseX = event.clientX - containerRect.left;
        const percentage = 0.2;

        const from = viewPortFrom;
        const to = viewPortFrom + width / xScale;
        const xPosRelative = this.toRelative(mouseX);
        const newViewPortWidth = to - from + (to - from) * percentage * (event.deltaY / 100);

        let newFrom = xPosRelative - newViewPortWidth * (from - xPosRelative) / (from - to);
        let newTo = xPosRelative + newViewPortWidth * (xPosRelative - to) / (from - to);
        if (newFrom < maxFrom && newTo > maxTo) {
            newFrom = maxFrom;
            newTo = maxTo;
        } else if (newFrom < maxFrom) {
            newFrom = maxFrom;
            newTo = maxFrom + newViewPortWidth;
        } else if (newTo > maxTo) {
            newFrom = maxTo - newViewPortWidth;
            newTo = maxTo;
        }
        const newXScale = width / (newTo - newFrom);
        const maxScale = width / (maxTo - maxFrom);
        this.setState({
            viewPortFrom: Math.max(maxFrom, newFrom),
            xScale: Math.max(newXScale, maxScale),
        });
        event.preventDefault();
    };

    toRelative(value: number): number {
        const { viewPortFrom, xScale } = this.state;
        if (xScale == null) {
            throw new Error("InvalidStateError");
        }
        return viewPortFrom + value / xScale;
    }

    render(): React.Element<*> {
        const { data, from, to, onItemClick } = this.props;
        const { width, xScale, viewPortFrom } = this.state;
        return (
            <Container ref={x => (this.container = x)}>
                {width != null &&
                    viewPortFrom != null &&
                    xScale != null &&
                    <MinimapContainer>
                        <ProfilerChartMinimap
                            data={{
                                lines: data.lines.map(line => ({
                                    items: line.items.map(item => ({ from: item.from, to: item.to, color: null })),
                                })),
                            }}
                            from={from}
                            to={to}
                            viewPort={{
                                from: viewPortFrom,
                                to: viewPortFrom + width / xScale,
                            }}
                            onChangeViewPort={x =>
                                this.setState({
                                    viewPortFrom: x.from,
                                    xScale: width / (x.to - x.from),
                                })}
                        />
                    </MinimapContainer>}
                {width != null &&
                    viewPortFrom != null &&
                    xScale != null &&
                    <ChartContainer onWheel={this.handleWheel}>
                        <div />
                        <div>
                            <ProfilerChartContainer
                                from={from}
                                to={to}
                                onChangeViewPort={x =>
                                    this.setState({
                                        viewPortFrom: Math.min(Math.max(from, x.from), to - width / xScale),
                                        xScale: x.scale,
                                    })}
                                viewPort={{
                                    from: viewPortFrom,
                                    scale: xScale,
                                }}>
                                <ProfilerChart
                                    from={from}
                                    to={to}
                                    xScale={xScale}
                                    data={data}
                                    onItemClick={onItemClick}
                                    onCustomDrawItem={this.props.onCustomDrawItem}
                                />
                            </ProfilerChartContainer>
                        </div>
                    </ChartContainer>}
            </Container>
        );
    }
}

const MinimapContainer = glamorous.div({
    //marginTop: "10px",
    borderBottom: "1px solid #eee",
});

const Container = glamorous.div({
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    maxHeight: "100%",
});

const ChartContainer = glamorous.div({
    flexShrink: 1,
    flexGrow: 0,
    overflowY: "auto",
});
