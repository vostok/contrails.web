// @flow
import moment from "moment";
import Decimal from "decimal.js";
import { InvalidProgramStateError } from "commons/Errors";

export type DurationTicks = string;
export type DurationMs = number;

export default class DateTimeUtils {
    static duractionRegex = /^[-+]?\d+$/i;

    static checkValidDuration(value: DurationTicks) {
        if (this.duractionRegex.test(value)) {
            throw new InvalidProgramStateError(`${value} is not a valid duration string`);
        }
    }

    static formatDatePreciseUtc(dateTimeString: string): string {
        const ticks = new Decimal(timestampToTicks(dateTimeString) || "0");
        return (
            moment(dateTimeString)
                .utc()
                .format("DD.MM.YYYY HH:mm:ss.SSS") +
            ticks
                .mod(10000)
                .toString()
                .padStart(4, "0")
        );
    }

    static formatDurationTicks(value: DurationTicks): string {
        const val = new Decimal(value);
        if (val.absoluteValue().lessThan(10000)) {
            return `${val.div(10000).toString()}ms`;
        }
        return (
            (val.isNegative() ? "-" : "") +
            this.millisecondsToString(
                val
                    .absoluteValue()
                    .div(10000)
                    .round()
                    .toNumber(),
                "0ms"
            )
        );
    }

    static difference(leftDateTimeString: string, rightDateTimeString: string): DurationTicks {
        const left = new Decimal(timestampToTicks(leftDateTimeString) || "0");
        const right = new Decimal(timestampToTicks(rightDateTimeString) || "0");
        return left.minus(right).toString();
    }

    static getDefaultTimeIntervalAsString(totalMilliSeconds: number): string {
        const numSeconds = Math.floor(totalMilliSeconds / 1000);
        if (numSeconds > 0) {
            return "0s";
        }
        return "0ms";
    }

    static millisecondsToString(totalMilliSeconds: number, zeroValue: string): string {
        // TODO добавить минуты, часы, дни, недели, месяцы, года(?)
        const numMinutes = Math.floor(totalMilliSeconds / 1000 / 60);
        const numSeconds = Math.floor((totalMilliSeconds / 1000) % 60);
        const milliSeconds = Math.round((totalMilliSeconds % 1000) * 10) / 10;
        let result = "";
        if (numMinutes !== 0) {
            result += result === "" ? "" : " ";
            result += `${numMinutes} min`;
        }
        if (numSeconds !== 0) {
            result += result === "" ? "" : " ";
            result += `${numSeconds}s`;
        }
        if (milliSeconds !== 0) {
            result += result === "" ? "" : " ";
            result += `${milliSeconds}ms`;
        }
        if (result === "") {
            return zeroValue;
        }
        return result;
    }
}

function timestampToTicks(timeStr: ?string | ?Date): ?string {
    if (!timeStr) return null;
    const offset = new Decimal("621355968000000000");
    let end = 0;
    let commonTime;
    if (typeof timeStr === "string") {
        commonTime = new Decimal(new Date(timeStr).getTime());
        const timeFractionalPartMatch = /\.(\d+)[^\d]/.exec(timeStr);
        if (timeFractionalPartMatch) {
            end = ((Number(`0.${timeFractionalPartMatch[1]}`) * 1000) % 1) * 10000;
        }
    } else {
        commonTime = new Decimal(timeStr.getTime());
    }
    return commonTime
        .mul(10000)
        .plus(offset)
        .plus(end)
        .toString();
}

export function ticksToTimestamp(timeStr: ?string | ?Date): ?Date {
    if (!timeStr) return null;
    const offset = new Decimal("621355968000000000");
    const commonTime = new Decimal(timeStr);
    return new Date(
        commonTime
            .minus(offset)
            .div(10000)
            .toNumber()
    );
}
