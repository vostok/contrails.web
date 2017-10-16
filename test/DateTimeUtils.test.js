// @flow
import { expect } from "chai";

import DateTimeUtils from "../src/Domain/DateTimeUtils";

describe("DateTimeUtils", () => {
    describe("difference", () => {
        it("should works", () => {
            expect(
                DateTimeUtils.difference("2017-08-21T15:26:47.1810001+03:00", "2017-08-21T15:26:47.1810000+03:00")
            ).to.eql("1");
            expect(
                DateTimeUtils.difference("2017-08-21T15:26:47.1810000+03:00", "2017-08-21T15:26:47.1810000+03:00")
            ).to.eql("0");
        });
        it("should works with different timezones", () => {
            expect(
                DateTimeUtils.difference("2017-08-21T12:26:47.1810001Z", "2017-08-21T15:26:47.1810000+03:00")
            ).to.eql("1");
        });
    });

    describe("formatDatePreciseUtc", () => {
        it("should works", () => {
            expect(DateTimeUtils.formatDatePreciseUtc("2017-08-21T15:26:47.1810001+03:00")).to.eql(
                "21.08.2017 12:26:47.1810001"
            );
        });
    });

    describe("formatDurationTicks", () => {
        it("format value less 10000", () => {
            expect(DateTimeUtils.formatDurationTicks("9999")).to.eql("0.9999ms");
        });
        it("format negative value less 10000", () => {
            expect(DateTimeUtils.formatDurationTicks("-9999")).to.eql("-0.9999ms");
        });
        it("format negative value greater than 10000", () => {
            expect(DateTimeUtils.formatDurationTicks("-100000")).to.eql("-10ms");
            expect(DateTimeUtils.formatDurationTicks("-101912")).to.eql("-10ms");
            expect(DateTimeUtils.formatDurationTicks("-109999")).to.eql("-11ms");
        });
        it("format negative greater than 10000", () => {
            expect(DateTimeUtils.formatDurationTicks("100000")).to.eql("10ms");
            expect(DateTimeUtils.formatDurationTicks("101912")).to.eql("10ms");
            expect(DateTimeUtils.formatDurationTicks("109999")).to.eql("11ms");
        });
    });
});
