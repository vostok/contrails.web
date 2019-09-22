// tslint:disable-next-line:no-null-keyword
export const emptyRef = null;

export function runAsyncAction(action: () => Promise<void>): void {
    // tslint:disable-next-line no-floating-promises
    action();
}
