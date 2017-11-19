// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import Button from "@skbkontur/react-ui/Button";

import ProfilerChart from "../src/components/ProfilerChart/ProfilerChart";
import type { ProfilerData } from "../src/components/ProfilerChart/ProfilerChart";
import ProfilerChartContainer from "../src/components/ProfilerChartContainer/ProfilerChartContainer";

function Border({ children }: { children: React.Node }): React.Node {
    return (
        <div
            style={{
                border: "1px solid #000",
                width: "400px",
                height: "200px",
            }}>
            {children}
        </div>
    );
}

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

class ProfilerChartDemo extends React.Component<ProfilerChartDemoProps, ProfilerChartDemoState> {
    props: ProfilerChartDemoProps;
    state: ProfilerChartDemoState = {
        viewPortFrom: 0,
        xScale: 100,
    };

    render(): React.Node {
        const { data } = this.props;
        const { xScale, viewPortFrom } = this.state;
        return (
            <div
                onWheel={(e: SyntheticWheelEvent<HTMLElement>) => {
                    this.setState({ xScale: xScale + e.deltaY / 100 * 5 });
                }}>
                <div />
                <div>
                    <ProfilerChartContainer
                        from={0}
                        to={6}
                        viewPort={{
                            from: viewPortFrom,
                            scale: xScale,
                        }}>
                        <ProfilerChart from={0} to={6} viewPort={{ from: 0, to: 6 }} xScale={xScale} data={data} />
                    </ProfilerChartContainer>
                </div>
                <div>
                    <Button onClick={() => this.setState({ viewPortFrom: viewPortFrom + 0.2 })}>+</Button>
                    <Button onClick={() => this.setState({ viewPortFrom: viewPortFrom - 0.2 })}>-</Button>
                </div>
            </div>
        );
    }
}

storiesOf("ProfilerChartContainer", module).add("Default", () => (
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
));
