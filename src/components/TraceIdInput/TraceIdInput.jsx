// @flow
import * as React from "react";
import { Button, Input } from "ui";

import cn from "./TraceIdInput.less";

type TraceIdInputProps = {
    value: string,
    onChange: string => void,
    onOpenTrace: () => void,
};

export default class TraceIdInput extends React.Component<TraceIdInputProps, void> {
    props: TraceIdInputProps;

    handleOpenTrace = () => {
        const { onOpenTrace } = this.props;
        onOpenTrace();
    };

    handleInputKeyPress = (e: SyntheticKeyboardEvent<*>) => {
        if (e.key === "Enter") {
            const { onOpenTrace } = this.props;
            onOpenTrace();
        }
    };

    render(): React.Node {
        const { value, onChange } = this.props;

        return (
            <div>
                <Input
                    placeholder="Введите TraceId"
                    autoFocus
                    width={500}
                    value={value}
                    onChange={(e, value) => onChange(value)}
                    onKeyPress={this.handleInputKeyPress}
                />
                <span className={cn("gap")} />
                <Button use="success" onClick={this.handleOpenTrace}>
                    Открыть
                </Button>
            </div>
        );
    }
}
