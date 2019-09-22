export interface IListenerHandler {
    remove(): void;
}

type MouseEventTypes = "mousemove" | "mouseup";

type MouseEventListener = (this: Document, ev: MouseEvent) => void;

class MouseListenerHandler implements IListenerHandler {
    public listener: MouseEventListener;
    public mouseEventName: MouseEventTypes;

    public constructor(mouseEventName: MouseEventTypes, listener: MouseEventListener) {
        this.listener = listener;
        this.mouseEventName = mouseEventName;

        if (document != undefined) {
            document.addEventListener(this.mouseEventName, this.listener);
        }
    }

    public remove(): void {
        if (document != undefined) {
            document.removeEventListener(this.mouseEventName, this.listener);
        }
    }
}

export class DocumentUtils {
    public static beginDragging(): void {
        if (document.body != undefined) {
            document.body.style.userSelect = "none";
        }
    }

    public static addMouseMoveListener(listener: MouseEventListener): IListenerHandler {
        return new MouseListenerHandler("mousemove", listener);
    }

    public static addMouseUpListener(listener: MouseEventListener): IListenerHandler {
        return new MouseListenerHandler("mouseup", listener);
    }

    public static endDragging(): void {
        if (document.body != undefined) {
            document.body.style.userSelect = "";
        }
    }
}
