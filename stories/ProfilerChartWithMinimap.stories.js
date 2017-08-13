// @flow
import React from "react";
import glamorous from "glamorous";
import { storiesOf } from "@storybook/react";
import Button from "@skbkontur/react-ui/Button";

import ProfilerChart from "../src/components/ProfilerChart";
import type { ProfilerData } from "../src/components/ProfilerChart";
import ProfilerChartContainer from "../src/components/ProfilerChartContainer";
import ProfilerChartMinimap from "../src/components/ProfilerChartMinimap";

const Border = glamorous.div({
    border: "1px solid #000",
    width: "400px",
    height: "200px",
});

type ProfilerItem = {
    from: number,
    to: number,
    name: string,
};

type ProfilerChartDemoProps = {
    data: ProfilerData<ProfilerItem>,
};

type ProfilerChartDemoState = {
    viewPortFrom: number,
    xScale: number,
};

class ProfilerChartDemo extends React.Component {
    props: ProfilerChartDemoProps;
    state: ProfilerChartDemoState = {
        viewPortFrom: 0,
        xScale: 100,
    };

    handleCustomDrawItem = (context: CanvasRenderingContext2D, item: ProfilerItem) => {
        context.strokeText(item.name, 5, 10);
    };

    render(): React.Element<*> {
        const { data } = this.props;
        const { xScale, viewPortFrom } = this.state;
        return (
            <div>
                <div>
                    <ProfilerChartMinimap
                        from={0}
                        to={10}
                        viewPort={{
                            from: viewPortFrom,
                            to: viewPortFrom + 400 / xScale,
                        }}
                        onChangeViewPort={x =>
                            this.setState({
                                viewPortFrom: x.from,
                                xScale: 400 / (x.to - x.from),
                            })}
                    />
                </div>
                <div
                    onWheel={(e: SyntheticWheelEvent) => {
                        this.setState({ xScale: xScale + e.deltaY / 100 * 5 });
                    }}>
                    <div />
                    <div>
                        <ProfilerChartContainer
                            from={0}
                            to={10}
                            viewPort={{
                                from: viewPortFrom,
                                scale: xScale,
                            }}>
                            <ProfilerChart
                                from={0}
                                to={10}
                                xScale={xScale}
                                data={data}
                                onCustomDrawItem={this.handleCustomDrawItem}
                            />
                        </ProfilerChartContainer>
                    </div>
                    <div>
                        <Button onClick={() => this.setState({ viewPortFrom: viewPortFrom + 0.2 })}>+</Button>
                        <Button onClick={() => this.setState({ viewPortFrom: viewPortFrom - 0.2 })}>-</Button>
                    </div>
                </div>
            </div>
        );
    }
}

storiesOf("ProfilerChartWithMinimap", module).add("Default", () =>
    <Border>
        <ProfilerChartDemo
            data={{
                lines: [
                    {
                        items: [{ from: 0, to: 2, name: "123" }, { from: 2.1, to: 3.993, name: "123" }],
                    },
                    {
                        items: [{ from: 0.5, to: 2, name: "123" }, { from: 2.6, to: 3.9, name: "123" }],
                    },
                    {
                        items: [{ from: 1, to: 1.5, name: "123" }, { from: 2, to: 2.9, name: "123" }],
                    },
                ],
            }}
        />
    </Border>
);
