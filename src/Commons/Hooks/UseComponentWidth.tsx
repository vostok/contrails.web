import * as React from "react";
import { ReactInstance, RefObject } from "react";
import ReactDOM from "react-dom";

import { emptyRef } from "../TypingHacks";

export function useComponentWidth<T extends ReactInstance | null | undefined>(
    defaultValue: number
): [number, RefObject<T>] {
    const container = React.useRef<T>(emptyRef);
    const [width, setWidth] = React.useState<number>(defaultValue);

    function updateContainerWidth(): void {
        const element = ReactDOM.findDOMNode(container.current);
        if (element instanceof HTMLElement) {
            setWidth(element.getBoundingClientRect().width);
        }
    }

    React.useEffect(() => {
        updateContainerWidth();
        window.addEventListener("resize", updateContainerWidth);
        return () => window.removeEventListener("resize", updateContainerWidth);
    }, []);

    return [width, container];
}
