// @flow
import * as React from "react";

import cn from "./Tabs.less";

type TabConfig = {
    name: string,
    caption: string,
    renderContent: () => React.Node,
};

type TabsProps = {
    tabs: TabConfig[],
};

type TabsState = {
    activeTabName: string,
};

export default class Tabs extends React.Component<TabsProps, TabsState> {
    props: TabsProps;
    state: TabsState;

    constructor(props: TabsProps) {
        super(props);
        this.state = {
            activeTabName: props.tabs[0].name,
        };
    }

    handleTabClick = (tabName: string) => {
        const { activeTabName } = this.state;
        if (activeTabName !== tabName) {
            this.setState({ activeTabName: tabName });
        }
    };

    render(): React.Element<*> {
        const { tabs } = this.props;
        const { activeTabName } = this.state;
        const activeTab = tabs.find(x => x.name === activeTabName);

        return (
            <div className={cn("root")}>
                <div className={cn("tabs")}>
                    {tabs.map(tab => (
                        <div
                            onClick={() => this.handleTabClick(tab.name)}
                            key={tab.name}
                            className={cn("tab", { active: tab === activeTab })}>
                            {tab.caption}
                        </div>
                    ))}
                </div>
                <div className={cn("content")}>{activeTab != null && activeTab.renderContent()}</div>
            </div>
        );
    }
}
