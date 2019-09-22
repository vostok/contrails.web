import * as React from "react";

const PIXEL_STEP = 10;
const LINE_HEIGHT = 40;
const PAGE_HEIGHT = 800;

interface NormalizeWheelResult {
    spinX: number;
    spinY: number;
    pixelX: number;
    pixelY: number;
}

export function normalizeWheel(event: React.WheelEvent): NormalizeWheelResult {
    let sX = 0;
    let sY = 0;
    let pX = 0;
    let pY = 0;

    // Legacy
    if ("detail" in event) {
        // @ts-ignore
        // tslint:disable-next-line no-unsafe-any
        sY = event.detail;
    }
    if ("wheelDelta" in event) {
        // @ts-ignore
        // tslint:disable-next-line no-unsafe-any
        sY = -event.wheelDelta / 120;
    }
    if ("wheelDeltaY" in event) {
        // @ts-ignore
        // tslint:disable-next-line no-unsafe-any
        sY = -event.wheelDeltaY / 120;
    }
    if ("wheelDeltaX" in event) {
        // @ts-ignore
        // tslint:disable-next-line no-unsafe-any
        sX = -event.wheelDeltaX / 120;
    }

    // side scrolling on FF with DOMMouseScroll
    // @ts-ignore
    // tslint:disable-next-line no-unsafe-any
    if ("axis" in event && event.axis === event.HORIZONTAL_AXIS) {
        sX = sY;
        sY = 0;
    }

    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if ("deltaY" in event) {
        pY = event.deltaY;
    }
    if ("deltaX" in event) {
        pX = event.deltaX;
    }

    if ((pX || pY) && event.deltaMode) {
        if (event.deltaMode === 1) {
            // delta in LINE units
            pX *= LINE_HEIGHT;
            pY *= LINE_HEIGHT;
        } else {
            // delta in PAGE units
            pX *= PAGE_HEIGHT;
            pY *= PAGE_HEIGHT;
        }
    }

    // Fall-back if spin cannot be determined
    if (pX && !sX) {
        sX = pX < 1 ? -1 : 1;
    }
    if (pY && !sY) {
        sY = pY < 1 ? -1 : 1;
    }

    return {
        spinX: sX,
        spinY: sY,
        pixelX: pX,
        pixelY: pY,
    };
}
