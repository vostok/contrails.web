export default function takeLastAndRejectPreviousImpl(func) {
    function result(...args) {
        return new Promise(async (resolve, reject) => {
            const currentRequest = result.requestIncrement++;
            result.lastRequestId = currentRequest;
            try {
                const functionResult = await func(...args);
                if (result.lastRequestId === currentRequest) {
                    resolve(functionResult);
                }
            } catch (e) {
                if (result.lastRequestId === currentRequest) {
                    reject(e);
                }
            }
        });
    }
    result.requestIncrement = 0;
    result.lastRequestId = null;
    return result;
}
