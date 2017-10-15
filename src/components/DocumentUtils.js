// @flow
export interface IListenerHandler {
    remove(): void,
}

class MouseListenerHandler implements IListenerHandler {
    listener: MouseEventListener;
    mouseEventName: MouseEventTypes;

    constructor(mouseEventName: MouseEventTypes, listener: MouseEventListener) {
        this.listener = listener;
        this.mouseEventName = mouseEventName;

        if (document != null) {
            document.addEventListener(this.mouseEventName, this.listener);
        }
    }

    remove() {
        if (document != null) {
            document.removeEventListener(this.mouseEventName, this.listener);
        }
    }
}

export default class DocumentUtils {
    static beginDragging() {
        if (document.body != null) {
            // @flow-disable-next-line
            document.body.style.userSelect = "none";
        }
    }

    static addMouseMoveListener(listener: MouseEventListener): IListenerHandler {
        return new MouseListenerHandler("mousemove", listener);
    }

    static addMouseUpListener(listener: MouseEventListener): IListenerHandler {
        return new MouseListenerHandler("mouseup", listener);
    }

    static endDragging() {
        if (document.body != null) {
            // @flow-disable-next-line
            document.body.style.userSelect = "";
        }
    }
}
