import * as React from "react";

import cn from "./Tabs.less";

interface TabConfig {
    name: string;
    caption: string;
    renderContent: () => React.ReactNode;
}

interface TabsProps {
    tabs: TabConfig[];
}

interface TabsState {
    activeTabName: string;
}

export class Tabs extends React.Component<TabsProps, TabsState> {
    public constructor(props: TabsProps) {
        super(props);
        this.state = {
            activeTabName: props.tabs[0].name,
        };
    }

    public handleTabClick = (tabName: string) => {
        const { activeTabName } = this.state;
        if (activeTabName !== tabName) {
            this.setState({ activeTabName: tabName });
        }
    };

    public render(): JSX.Element {
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
                <div key={activeTab ? activeTab.name : "NONE"} className={cn("content")}>
                    {activeTab != undefined && activeTab.renderContent()}
                </div>
            </div>
        );
    }
}
