export class OperationAbortedError extends Error {
    private readonly signal: AbortSignal;

    public constructor(message: string, token: AbortSignal) {
        super(message);
        this.signal = token;
    }

    public get cancellationToken(): AbortSignal {
        return this.signal;
    }
}

export class PromiseUtils {
    public static delay(timeout: number, abortSignal?: AbortSignal): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const timer = !abortSignal || !abortSignal.aborted ? setTimeout(resolve, timeout) : 0;
            if (abortSignal) {
                abortSignal.addEventListener("abort", () => {
                    clearTimeout(timer);
                    try {
                        this.throwIfCancellationRequested(abortSignal);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
        });
    }

    public static fromToken<T>(abortSignal?: AbortSignal): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (abortSignal) {
                abortSignal.addEventListener("abort", () => {
                    try {
                        this.throwIfCancellationRequested(abortSignal);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
        });
    }

    public static resolveAfter<T>(promise: Promise<T>, timeout: number, token?: AbortSignal): Promise<T> {
        return Promise.all([this.withCancellation(promise, token), this.delay(timeout, token)]).then(x => x[0]);
    }

    public static continueAfter<T>(promise: Promise<T>, timeout: number, token?: AbortSignal): Promise<T> {
        return this.delay(timeout, token).then(() => this.withCancellation(promise, token));
    }

    public static withCancellation<T>(promise: Promise<T>, token?: AbortSignal): Promise<T> {
        return Promise.race([this.fromToken<T>(token), promise]);
    }

    private static throwIfCancellationRequested(signal: AbortSignal): void {
        if (signal.aborted) {
            throw new OperationAbortedError("Operation canceled", signal);
        }
    }
}
