import * as React from "react";

import { getGrafanaTraceUrl } from "../../Domain/GrafanaUtils";

import cn from "./GrafanaBanner.less";

const BANNER_CLOSED_STORAGE_KEY = "vostok:contrails:grafana-banner:closed";

function isBannerClosed(): boolean {
    try {
        return localStorage.getItem(BANNER_CLOSED_STORAGE_KEY) === "true";
    } catch {
        return false;
    }
}

function setBannerClosed(): void {
    try {
        localStorage.setItem(BANNER_CLOSED_STORAGE_KEY, "true");
    } catch {
        // ignore
    }
}

interface GrafanaBannerProps {
    traceId?: string;
}

export function GrafanaBanner({ traceId }: GrafanaBannerProps): JSX.Element | null {
    // tslint:disable-next-line:no-null-keyword
    const [closed, setClosed] = React.useState(isBannerClosed);

    if (closed) {
        // tslint:disable-next-line:no-null-keyword
        return null;
    }

    const handleClose = React.useCallback(() => {
        setBannerClosed();
        setClosed(true);
    }, []);

    return (
        <div className={cn("container")}>
            <div className={cn("text")}>
                NEW! View traces in the{" "}
                <a href={getGrafanaTraceUrl(traceId)} target="_blank" rel="noopener noreferrer">
                    Grafana Tempo
                </a>
            </div>
            <div className={cn("spacer")} />
            <button className={cn("close")} onClick={handleClose} type="button" aria-label="Close">
                &times;
            </button>
        </div>
    );
}
