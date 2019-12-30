import * as React from "react";

import { Button, Input } from "../../Commons/ui";

import cn from "./TraceIdInput.less";

interface TraceIdInputProps {
    value: string;
    onChange: (value: string) => void;
    onOpenTrace: () => void;
}

export function TraceIdInput({ value, onChange, onOpenTrace }: TraceIdInputProps): JSX.Element {
    const handleOpenTrace = React.useCallback(onOpenTrace, [onOpenTrace]);

    const handleInputKeyPress = React.useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                onOpenTrace();
            }
        },
        [onOpenTrace]
    );

    return (
        <div>
            <Input
                placeholder="TraceId"
                autoFocus
                width={500}
                value={value}
                onChange={(e, nextValue) => onChange(nextValue)}
                onKeyPress={handleInputKeyPress}
            />
            <span className={cn("gap")} />
            <Button use="success" onClick={handleOpenTrace}>
                Open
            </Button>
        </div>
    );
}
