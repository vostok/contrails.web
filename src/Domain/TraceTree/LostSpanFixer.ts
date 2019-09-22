import _ from "lodash";
import moment from "moment";

import { InvalidProgramStateError } from "../../Commons/Errors";

interface SpanBase {
    SpanId: string;
    ParentSpanId?: null | string;
    BeginTimestamp: string;
    EndTimestamp: string;
}

interface SpanRange {
    BeginTimestamp: string;
    EndTimestamp: string;
}

export type SpanFactory<T> = (
    spanId: string,
    parentSpanId: undefined | string,
    beginTimestamp: string,
    endTimestamp: string
) => T;

export class LostSpanFixer {
    public fix<T extends SpanBase>(spans: T[], createFakeSpan: SpanFactory<T>): T[] {
        let result = [...spans];
        const spanIds = spans.map(x => x.SpanId);
        result = this.fixParentSpanIfNeed(result, createFakeSpan);
        const lostSpans = spans.filter(x => x.ParentSpanId != undefined && !spanIds.includes(x.ParentSpanId));
        for (const lostSpan of lostSpans) {
            if (result.find(x => x.SpanId === lostSpan.ParentSpanId) != undefined) {
                continue;
            }
            const parentSpanId = lostSpan.ParentSpanId;
            const mostSuitableParent = this.findMostSuitableParent(result, lostSpan);
            if (mostSuitableParent == undefined) {
                continue;
            }
            if (parentSpanId == undefined) {
                throw new Error("InvalidProgramState");
            }
            const childrenOfFakeSpan = spans.filter(x => x.ParentSpanId === parentSpanId);
            const min = _.minBy(childrenOfFakeSpan.map(x => x.BeginTimestamp), x => moment(x).toDate());
            const max = _.maxBy(childrenOfFakeSpan.map(x => x.EndTimestamp), x => moment(x).toDate());
            if (min == undefined || max == undefined) {
                throw new InvalidProgramStateError();
            }
            const fakeSpan = createFakeSpan(parentSpanId, mostSuitableParent.SpanId, min, max);
            result.push(fakeSpan);
        }
        return result;
    }

    public fixParentSpanIfNeed<T extends SpanBase>(spans: T[], createFakeSpan: SpanFactory<T>): T[] {
        if (spans.find(x => x.ParentSpanId == undefined) != undefined) {
            return spans;
        }
        const min = _.minBy(spans, x => moment(x.BeginTimestamp).toDate());
        const max = _.maxBy(spans, x => moment(x.EndTimestamp).toDate());
        if (min == undefined || max == undefined) {
            throw new InvalidProgramStateError();
        }
        return [...spans, createFakeSpan("FakeRootSpanId", undefined, min.BeginTimestamp, max.EndTimestamp)];
    }

    public findMostSuitableParent<T extends SpanBase>(spans: T[], target: T): undefined | T {
        const targetChildren = this.getAllChildren(spans, target);
        const potentialParents = _.difference(spans, targetChildren);
        const intersectedParents = potentialParents.filter(x => this.isIntersectsByRange(x, target));
        if (intersectedParents.length === 0) {
            const nearestPotentialParent = _.minBy(potentialParents, x => this.getDistanceTo(x, target));
            return nearestPotentialParent;
        }
        const result = _.maxBy(
            intersectedParents,
            x => this.getSpanIntersectionLength(x, target) * 100000 - this.getSpanLength(x)
        );
        if (result == undefined) {
            return undefined;
        }
        return result;
    }

    public getAllChildren<T extends SpanBase>(spans: T[], target: T): T[] {
        const children = spans.filter(x => x.ParentSpanId === target.SpanId);
        return [target, ..._.flatten(children.map(x => this.getAllChildren(spans, x)))];
    }

    public isIntersectsByRange<T extends SpanBase>(span: T, target: T): boolean {
        return this.getSpanIntersection(span, target) != undefined;
    }

    public getSpanIntersectionLength(left: SpanBase, right: SpanBase): number {
        const intersection = this.getSpanIntersection(left, right);
        if (intersection == undefined) {
            return 0;
        }
        return this.getSpanLength(intersection);
    }

    public getDistanceTo(left: SpanBase, right: SpanBase): number {
        const leftFrom = moment(left.BeginTimestamp)
            .toDate()
            .valueOf();
        const leftTo = moment(left.EndTimestamp)
            .toDate()
            .valueOf();
        const rightFrom = moment(right.BeginTimestamp)
            .toDate()
            .valueOf();
        const rightTo = moment(right.EndTimestamp)
            .toDate()
            .valueOf();
        return Math.min(
            Math.abs(leftFrom - rightTo),
            Math.abs(leftFrom - rightFrom),
            Math.abs(leftTo - rightTo),
            Math.abs(leftTo - rightFrom)
        );
    }

    public getSpanLength(span: SpanRange): number {
        return (
            moment(span.EndTimestamp)
                .toDate()
                .valueOf() -
            moment(span.BeginTimestamp)
                .toDate()
                .valueOf()
        );
    }

    public getSpanIntersection(left: SpanRange, right: SpanRange): undefined | SpanRange {
        const leftFrom = moment(left.BeginTimestamp).toDate();
        const leftTo = moment(left.EndTimestamp).toDate();
        const rightFrom = moment(right.BeginTimestamp).toDate();
        const rightTo = moment(right.EndTimestamp).toDate();

        if (leftTo <= rightFrom) {
            return undefined;
        }
        if (leftFrom >= rightTo) {
            return undefined;
        }
        if (leftFrom <= rightFrom && rightFrom < leftTo && leftTo <= rightTo) {
            return { BeginTimestamp: right.BeginTimestamp, EndTimestamp: left.EndTimestamp };
        }
        if (leftFrom <= rightFrom && rightFrom < leftTo && rightTo <= leftTo) {
            return { BeginTimestamp: right.BeginTimestamp, EndTimestamp: right.EndTimestamp };
        }
        if (rightFrom <= leftFrom && leftFrom < rightTo && rightTo <= leftTo) {
            return { BeginTimestamp: left.BeginTimestamp, EndTimestamp: right.EndTimestamp };
        }
        if (rightFrom <= leftFrom && leftFrom < rightTo && leftTo <= rightTo) {
            return { BeginTimestamp: left.BeginTimestamp, EndTimestamp: left.EndTimestamp };
        }
        return undefined;
    }

    public getDifferenceBetween<T extends SpanBase>(span: T, target: T): number {
        const parentDuration =
            moment(span.EndTimestamp)
                .toDate()
                .getTime() -
            moment(span.BeginTimestamp)
                .toDate()
                .getTime();
        const targetDuration =
            moment(target.EndTimestamp)
                .toDate()
                .getTime() -
            moment(target.BeginTimestamp)
                .toDate()
                .getTime();
        return parentDuration - targetDuration;
    }
}
