// @noflow

function buildExtendableError(name: string) {
    function ExtendableError(message: string) {
        if (!Error.captureStackTrace) {
            this.stack = new Error().stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
        this.message = message;
    }
    // @flow-disable-next-line
    ExtendableError.prototype = new Error();
    ExtendableError.prototype.name = name;
    // @flow-disable-next-line
    ExtendableError.prototype.constructor = ExtendableError;
    return ExtendableError;
}

export const ApplicationError = buildExtendableError("ApplicationError");
