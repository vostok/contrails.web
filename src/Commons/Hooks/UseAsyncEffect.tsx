import * as React from "react";

import { runAsyncAction } from "../TypingHacks";

export function useAsyncEffect(action: (abortSignal: AbortSignal) => Promise<void>, deps?: React.DependencyList): void {
    React.useEffect(() => {
        const abortController = new AbortController();
        runAsyncAction(() => action(abortController.signal));
        return () => {
            abortController.abort();
        };
    }, deps);
}
