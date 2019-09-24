import * as React from "react";

import cn from "./Tabs.less";

export interface TabConfig {
    name: string;
    caption: string;
    renderContent: () => React.ReactNode;
}

interface TabsProps {
    tabs: TabConfig[];
}

export function Tabs({ tabs }: TabsProps): JSX.Element {
    const [activeTabName, setActiveTabName] = React.useState(tabs[0].name);
    const activeTab = tabs.find(x => x.name === activeTabName);

    return (
        <div className={cn("root")}>
            <div className={cn("tabs")}>
                {tabs.map(tab => (
                    <div
                        onClick={() => setActiveTabName(tab.name)}
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
