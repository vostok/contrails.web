// @flow
import * as React from "react";
import glamurous from "glamorous";

import type { SpanInfo } from "../../Domain/SpanInfo";

type SpanInfoViewProps = {
    spanInfo: SpanInfo,
};

export default function SpanInfoView({ spanInfo }: SpanInfoViewProps): React.Node {
    const annotations = spanInfo.Annotations;
    return (
        <div>
            <Section>
                <SectionHeader>General</SectionHeader>
                <Item>
                    <Caption>TraceId:</Caption>
                    <Value>
                        {spanInfo.TraceId}
                    </Value>
                </Item>

                <Item>
                    <Caption>SpanId:</Caption>
                    <Value>
                        {spanInfo.SpanId}
                    </Value>
                </Item>
                <Item>
                    <Caption>ParentSpanId:</Caption>
                    <Value>
                        {spanInfo.ParentSpanId}
                    </Value>
                </Item>
                <Item>
                    <Caption>OperationName:</Caption>
                    <Value>
                        {spanInfo.OperationName}
                    </Value>
                </Item>
                <Item>
                    <Caption>BeginTimestamp:</Caption>
                    <Value>
                        {spanInfo.BeginTimestamp}
                    </Value>
                </Item>
                <Item>
                    <Caption>EndTimestamp:</Caption>
                    <Value>
                        {spanInfo.EndTimestamp}
                    </Value>
                </Item>
            </Section>
            {annotations != null &&
                <Section>
                    <SectionHeader>Annotations</SectionHeader>
                    {Object.getOwnPropertyNames(annotations).map(x =>
                        <Item>
                            <Caption>
                                {x}:
                            </Caption>
                            <Value>
                                {annotations[x]}
                            </Value>
                        </Item>
                    )}
                </Section>}
        </div>
    );
}

const Section = glamurous.div({
    marginBottom: 10,
});

const SectionHeader = glamurous.div({
    fontSize: "16px",
    marginBottom: 5,
});

const Item = glamurous.div({});

const Caption = glamurous.span({
    display: "inline-block",
    color: "#111",
    fontWeight: 600,
    marginRight: 10,
});

const Value = glamurous.span({
    fontFamily: "Consolas, monospace",
    fontSize: "13px",
});
