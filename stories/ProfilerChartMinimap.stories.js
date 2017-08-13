// @flow
import React from "react";
import glamorous from "glamorous";
import { storiesOf } from "@storybook/react";
import Button from "@skbkontur/react-ui/Button";

import ProfilerChartMinimap from "../src/components/ProfilerChartMinimap";
import type { ProfilerData } from "../src/components/ProfilerChart";

const Border = glamorous.div({
    border: "1px solid #000",
    width: "400px",
    height: "200px",
    margin: "0 auto",
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
    viewPort: {
        from: number,
        to: number,
    },
};

class ProfilerChartMinimapDemo extends React.Component {
    props: ProfilerChartDemoProps;
    state: ProfilerChartDemoState = {
        viewPort: {
            from: 5,
            to: 7,
        },
    };

    handleCustomDrawItem = (context: CanvasRenderingContext2D, item: ProfilerItem) => {
        context.strokeText(item.name, 5, 10);
    };

    handleChangeViewPort(viewPort: { from: number, to: number }) {
        this.setState({ viewPort: viewPort });
    }

    render(): React.Element<*> {
        const { data } = this.props;
        const { viewPort } = this.state;

        return (
            <div>
                <div>
                    <ProfilerChartMinimap
                        data={data}
                        from={0}
                        to={10}
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

storiesOf("ProfilerChartMinimap", module).add("Default", () =>
    <Border>
        <ProfilerChartMinimapDemo
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
