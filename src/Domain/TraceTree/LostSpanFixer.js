// @flow
import moment from "moment";
import _ from "lodash";

import { reduceTree, isChildReducer } from "../Utils/TreeTraverseUtils";

type SpanBase = {
    SpanId: string,
    ParentSpanId?: ?string,
    BeginTimestamp: string,
    EndTimestamp: string,
};

type SpanRange = {
    BeginTimestamp: string,
    EndTimestamp: string,
};

export type SpanFactory<T> = (spanId: string, parentSpanId: ?string, beginTimestamp: string, endTimestamp: string) => T;

export default class LostSpanFixer {
    fix<T: SpanBase>(spans: Array<T>, createFakeSpan: SpanFactory<T>): Array<T> {
        let result = [...spans];
        const spanIds = spans.map(x => x.SpanId);
        result = this.fixParentSpanIfNeed(result, createFakeSpan);
        const lostSpans = spans.filter(x => x.ParentSpanId != null).filter(x => !spanIds.includes(x.ParentSpanId));
        for (const lostSpan of lostSpans) {
            if (result.find(x => x.SpanId === lostSpan.ParentSpanId) != null) {
                continue;
            }
            const parentSpanId = lostSpan.ParentSpanId;
            const mostSuitableParent = this.findMostSuitableParent(result, lostSpan);
            if (mostSuitableParent == null) {
                continue;
            }
            if (parentSpanId == null) {
                throw new Error("InvalidProgramState");
            }
            const childrenOfFakeSpan = spans.filter(x => x.ParentSpanId === parentSpanId);
            const fakeSpan = createFakeSpan(
                parentSpanId,
                mostSuitableParent.SpanId,
                _.minBy(childrenOfFakeSpan.map(x => x.BeginTimestamp), x => moment(x).toDate()),
                _.maxBy(childrenOfFakeSpan.map(x => x.EndTimestamp), x => moment(x).toDate())
            );
            result.push(fakeSpan);
        }
        return result;
    }

    fixParentSpanIfNeed<T: SpanBase>(spans: Array<T>, createFakeSpan: SpanFactory<T>): Array<T> {
        if (spans.find(x => x.ParentSpanId == null) != null) {
            return spans;
        }
        return [
            ...spans,
            createFakeSpan(
                "FakeRootSpanId",
                null,
                _.minBy(spans, x => moment(x.BeginTimestamp).toDate()).BeginTimestamp,
                _.maxBy(spans, x => moment(x.EndTimestamp).toDate()).EndTimestamp
            ),
        ];
    }

    findMostSuitableParent<T: SpanBase>(spans: Array<T>, target: T): ?T {
        const potentialParents = spans.filter(x => this.isSpanCanBeParent(spans, x, target));
        const intersectedParents = potentialParents.filter(x => this.isIntersectsByRange(x, target));
        if (intersectedParents.length === 0) {
            const nearestPotentialParents = _.sortBy(spans.filter(x => this.isSpanCanBeParent(spans, x, target)), x =>
                this.getDistanceTo(x, target)
            );
            if (nearestPotentialParents.length === 0) {
                return null;
            }
            return nearestPotentialParents[0];
        }
        const sorted = _.sortBy(intersectedParents, [
            x => this.getSpanIntersectionLength(x, target),
            x => this.getSpanLength(x),
        ]);
        if (sorted.length === 0) {
            return null;
        }
        return sorted[0];
    }

    isSpanCanBeParent<T: SpanBase>(spans: Array<T>, span: T, target: T): boolean {
        if (target === span) {
            return false;
        }
        return !reduceTree(target, isChildReducer(span), node => spans.filter(x => x.ParentSpanId === node.SpanId));
    }

    isIntersectsByRange<T: SpanBase>(span: T, target: T): boolean {
        return this.getSpanIntersection(span, target) != null;
    }

    getSpanIntersectionLength(left: SpanBase, right: SpanBase): number {
        const intersection = this.getSpanIntersection(left, right);
        if (intersection == null) {
            return 0;
        }
        return this.getSpanLength(intersection);
    }

    getDistanceTo(left: SpanBase, right: SpanBase): number {
        const leftFrom = moment(left.BeginTimestamp).toDate();
        const leftTo = moment(left.EndTimestamp).toDate();
        const rightFrom = moment(right.BeginTimestamp).toDate();
        const rightTo = moment(right.EndTimestamp).toDate();
        return Math.min(
            Math.abs(leftFrom - rightTo),
            Math.abs(leftFrom - rightFrom),
            Math.abs(leftTo - rightTo),
            Math.abs(leftTo - rightFrom)
        );
    }

    getSpanLength(span: SpanRange): number {
        return moment(span.EndTimestamp).toDate() - moment(span.BeginTimestamp).toDate();
    }

    getSpanIntersection(left: SpanRange, right: SpanRange): ?SpanRange {
        const leftFrom = moment(left.BeginTimestamp).toDate();
        const leftTo = moment(left.EndTimestamp).toDate();
        const rightFrom = moment(right.BeginTimestamp).toDate();
        const rightTo = moment(right.EndTimestamp).toDate();

        if (leftTo <= rightFrom) {
            return null;
        }
        if (leftFrom >= rightTo) {
            return null;
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
        return null;
    }

    getDifferenceBetween<T: SpanBase>(span: T, target: T): number {
        const parentDuration =
            moment(span.EndTimestamp).toDate().getTime() - moment(span.BeginTimestamp).toDate().getTime();
        const targetDuration =
            moment(target.EndTimestamp).toDate().getTime() - moment(target.BeginTimestamp).toDate().getTime();
        return parentDuration - targetDuration;
    }
}
