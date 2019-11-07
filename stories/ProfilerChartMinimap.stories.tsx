import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Button } from "../src/Commons/ui";
import { ProfilerData } from "../src/Components/ProfilerChart/Internal/ProfilerChartDrawer";
import { ProfilerChartMinimap } from "../src/Components/ProfilerChartMinimap/ProfilerChartMinimap";
import { TimeRange } from "../src/Domain/TimeRange";

function Border({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <div
            style={{
                border: "1px solid #000",
                width: "400px",
                height: "200px",
                margin: "0 auto",
            }}>
            {children}
        </div>
    );
}

interface ProfilerItem {
    from: number;
    to: number;
    color?: undefined | string;
}

interface ProfilerChartDemoProps {
    data: ProfilerData<ProfilerItem>;
    from: number;
    to: number;
}

interface ProfilerChartDemoState {
    viewPort: TimeRange;
}

class ProfilerChartMinimapDemo extends React.Component<ProfilerChartDemoProps, ProfilerChartDemoState> {
    public constructor(props: ProfilerChartDemoProps) {
        super(props);
        this.state = {
            viewPort: {
                from: props.from + (props.to - props.from) / 2 - (props.to - props.from) / 5,
                to: props.from + (props.to - props.from) / 2 + (props.to - props.from) / 5,
            },
        };
    }

    public handleChangeViewPort(viewPort: { from: number; to: number }): void {
        this.setState({ viewPort: viewPort });
    }

    public render(): JSX.Element {
        const { data, from, to } = this.props;
        const { viewPort } = this.state;

        return (
            <div>
                <div>
                    <ProfilerChartMinimap
                        data={data}
                        timeRange={{ from: from, to: to }}
                        viewPort={viewPort}
                        width={500}
                        onChangeViewPort={x => this.handleChangeViewPort(x)}
                    />
                </div>
                <div>
                    <Button onClick={() => this.setState({ viewPort: { ...viewPort, from: viewPort.from + 0.4 } })}>
                        +
                    </Button>
                    <Button onClick={() => this.setState({ viewPort: { ...viewPort, from: viewPort.from - 0.4 } })}>
                        -
                    </Button>
                </div>
            </div>
        );
    }
}

storiesOf("ProfilerChartMinimap", module)
    .add("Default", () => (
        <Border>
            <ProfilerChartMinimapDemo
                from={0}
                to={10}
                data={{
                    lines: [
                        {
                            items: [{ from: 0, to: 10 }],
                        },
                        {
                            items: [{ from: 0, to: 2 }, { from: 2.1, to: 3.993 }],
                        },
                        {
                            items: [{ from: 0.5, to: 2 }, { from: 2.6, to: 3.9 }],
                        },
                        {
                            items: [{ from: 1, to: 1.5 }, { from: 2, to: 2.9 }],
                        },
                        {
                            items: [{ from: 1, to: 1.5 }, { from: 2, to: 2.9 }],
                        },
                        {
                            items: [{ from: 1, to: 1.5 }, { from: 2, to: 2.9 }],
                        },
                    ],
                }}
            />
        </Border>
    ))
    .add("NonZeroFrom", () => (
        <Border>
            <ProfilerChartMinimapDemo
                from={10}
                to={20}
                data={{
                    lines: [
                        {
                            items: [{ from: 11, to: 19 }],
                        },
                    ],
                }}
            />
        </Border>
    ));
