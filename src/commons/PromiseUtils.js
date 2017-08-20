// @flow

export default class PromsieUtils {
    static delay(timeout: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(() => resolve(), timeout);
        });
    }
}
