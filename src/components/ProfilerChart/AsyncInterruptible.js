// @flow

type AsyncProcedure = () => Promise<void>;

export interface IInterruptibleContext {
    check(): Promise<void>;
}

class InterruptibleContext implements IInterruptibleContext {
    drawing: boolean = false;
    nextDrawResolve: ?(boolean) => void = null;
    timer: number = new Date().getTime();

    async start(): Promise<boolean> {
        if (this.drawing) {
            if (this.nextDrawResolve != null) {
                this.nextDrawResolve(false);
            }
            const canContinue = await new Promise(resolve => {
                this.nextDrawResolve = resolve;
            });
            if (!canContinue) {
                return false;
            }
            this.nextDrawResolve = null;
            this.drawing = true;
            this.timer = new Date().getTime();
            return true;
        }
        this.drawing = true;
        this.timer = new Date().getTime();
        return true;
    }

    complete() {
        this.drawing = false;
    }

    cancelComplete() {
        if (this.nextDrawResolve != null) {
            this.nextDrawResolve(true);
        }
    }

    async check(): Promise<void> {
        if (new Date().getTime() - this.timer > 30) {
            await delay(0);
            if (this.nextDrawResolve != null) {
                throw new InterruptedError();
            }
            this.timer = new Date().getTime();
        }
    }
}

export class InterruptedError {}

// eslint-disable-next-line flowtype/no-weak-types
export function interruptible(factory: InterruptibleContext => AsyncProcedure): AsyncProcedure {
    const context = new InterruptibleContext();
    const fn = factory(context);
    return async () => {
        const canContinue = await context.start();
        if (!canContinue) {
            return;
        }
        try {
            await fn();
            context.complete();
        } catch (e) {
            if (e instanceof InterruptedError) {
                context.cancelComplete();
            } else {
                throw e;
            }
        }
    };
}

function delay(timeout: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
