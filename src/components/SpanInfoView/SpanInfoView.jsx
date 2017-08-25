// @flow
import * as React from "react";

import type { SpanInfo } from "../../Domain/SpanInfo";

import cn from "./SpanInfoView.less";

type SpanInfoViewProps = {
    spanInfo: SpanInfo,
};

export default function SpanInfoView({ spanInfo }: SpanInfoViewProps): React.Node {
    const annotations = spanInfo.Annotations;
    return (
        <div>
            <div className={cn("section")}>
                <div className={cn("section-header")}>General</div>
                <div className={cn("item")}>
                    <div className={cn("caption")}>TraceId:</div>
                    <span className={cn("value")}>
                        {spanInfo.TraceId}
                    </span>
                </div>

                <div className={cn("item")}>
                    <div className={cn("caption")}>SpanId:</div>
                    <span className={cn("value")}>
                        {spanInfo.SpanId}
                    </span>
                </div>
                <div className={cn("item")}>
                    <div className={cn("caption")}>ParentSpanId:</div>
                    <span className={cn("value")}>
                        {spanInfo.ParentSpanId}
                    </span>
                </div>
                <div className={cn("item")}>
                    <div className={cn("caption")}>OperationName:</div>
                    <span className={cn("value")}>
                        {spanInfo.OperationName}
                    </span>
                </div>
                <div className={cn("item")}>
                    <div className={cn("caption")}>BeginTimestamp:</div>
                    <span className={cn("value")}>
                        {spanInfo.BeginTimestamp}
                    </span>
                </div>
                <div className={cn("item")}>
                    <div className={cn("caption")}>EndTimestamp:</div>
                    <span className={cn("value")}>
                        {spanInfo.EndTimestamp}
                    </span>
                </div>
            </div>
            {annotations != null &&
                <div className={cn("section")}>
                    <div className={cn("section-header")}>Annotations</div>
                    {Object.getOwnPropertyNames(annotations).map(x =>
                        <div key={x} className={cn("item")}>
                            <div className={cn("caption")}>
                                {x}:
                            </div>
                            <span className={cn("value")}>
                                {annotations[x]}
                            </span>
                        </div>
                    )}
                </div>}
        </div>
    );
}
