/* tslint:disable no-any no-unsafe-any no-void-expression */
/**
 * Workaround for chrome bug:
 * https://www.chromestatus.com/feature/6662647093133312
 * https://github.com/facebook/react/issues/14856#issuecomment-478144231
 */
export function wheelPreventDefaultChromeWorkaround(): void {
    const EVENTS_TO_MODIFY = ["touchstart", "touchmove", "touchend", "touchcancel", "wheel"];

    // @ts-ignore
    const originalAddEventListener = document.addEventListener.bind();

    // @ts-ignore
    document.addEventListener = (type: any, listener: any, options: any, wantsUntrusted: any) => {
        let modOptions = options;
        if (EVENTS_TO_MODIFY.includes(type)) {
            if (typeof options === "boolean") {
                modOptions = {
                    capture: options,
                    passive: false,
                };
            } else if (typeof options === "object") {
                modOptions = {
                    passive: false,
                    ...options,
                };
            }
        }

        return originalAddEventListener(type, listener, modOptions, wantsUntrusted);
    };

    // @ts-ignore
    const originalRemoveEventListener = document.removeEventListener.bind();
    document.removeEventListener = (type: any, listener: any, options: any) => {
        let modOptions = options;
        if (EVENTS_TO_MODIFY.includes(type)) {
            if (typeof options === "boolean") {
                modOptions = {
                    capture: options,
                    passive: false,
                };
            } else if (typeof options === "object") {
                modOptions = {
                    passive: false,
                    ...options,
                };
            }
        }
        return originalRemoveEventListener(type, listener, modOptions);
    };
}
