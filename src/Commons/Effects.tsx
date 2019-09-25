import _ from "lodash";
import * as React from "react";

import { runAsyncAction } from "./TypingHacks";

export function useAsyncEffect(action: (abortSignal: AbortSignal) => Promise<void>, deps?: React.DependencyList): void {
    React.useEffect(() => {
        const abortController = new AbortController();
        runAsyncAction(() => action(abortController.signal));
        return () => {
            abortController.abort();
        };
    }, deps);
}

export function useDebounceCallback<TA extends unknown[]>(
    action: (...args: TA) => void,
    delay: number,
    deps?: React.DependencyList
): (...args: TA) => void {
    const actionRef = React.useRef(action);

    React.useEffect(() => (actionRef.current = action), deps);

    const debouncedActionRef = React.useRef(_.debounce((...args: TA) => actionRef.current(...args), delay));

    return debouncedActionRef.current;
}
