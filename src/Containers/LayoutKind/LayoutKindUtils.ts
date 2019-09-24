import { LayoutKind } from "./LayoutKind";

export class LayoutKindUtils {
    public static saveLayoutKind(value: LayoutKind): void {
        localStorage.setItem("vostok:contrails", JSON.stringify({ layoutKind: value }));
    }

    public static getLayoutKind(): LayoutKind {
        try {
            // tslint:disable-next-line no-unsafe-any
            const settings: { layoutKind: LayoutKind } = JSON.parse(
                localStorage.getItem("vostok:contrails") || "undefined"
            );
            if (
                settings.layoutKind === LayoutKind.MinimapAndTree ||
                settings.layoutKind === LayoutKind.ChartWithMinimapAndTree
            ) {
                return settings.layoutKind;
            }
            return LayoutKind.ChartWithMinimapAndTree;
        } catch {
            return LayoutKind.ChartWithMinimapAndTree;
        }
    }
}
