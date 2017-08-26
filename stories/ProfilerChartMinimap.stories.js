// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import Button from "@skbkontur/react-ui/Button";

import ProfilerChartMinimap from "../src/components/ProfilerChartMinimap/ProfilerChartMinimap";
import type { ProfilerData } from "../src/components/ProfilerChart/ProfilerChart";

function Border({ children }: { children: React.Node }): React.Node {
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

type ProfilerItem = {
    from: number,
    to: number,
    color?: ?string,
};

type ProfilerChartDemoProps = {
    data: ProfilerData<ProfilerItem>,
    from: number,
    to: number,
};

type ProfilerChartDemoState = {
    viewPort: {
        from: number,
        to: number,
    },
};

class ProfilerChartMinimapDemo extends React.Component<*, *> {
    props: ProfilerChartDemoProps;
    state: ProfilerChartDemoState;

    constructor(props: ProfilerChartDemoProps) {
        super(props);
        this.state = {
            viewPort: {
                from: props.from + (props.to - props.from) / 2 - (props.to - props.from) / 5,
                to: props.from + (props.to - props.from) / 2 + (props.to - props.from) / 5,
            },
        };
    }

    handleChangeViewPort(viewPort: { from: number, to: number }) {
        this.setState({ viewPort: viewPort });
    }

    render(): React.Element<*> {
        const { data, from, to } = this.props;
        const { viewPort } = this.state;

        return (
            <div>
                <div>
                    <ProfilerChartMinimap
                        data={data}
                        from={from}
                        to={to}
                        viewPort={viewPort}
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
    .add("Default", () =>
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
    )
    .add("NonZeroFrom", () =>
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
    );
