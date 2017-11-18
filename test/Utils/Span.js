// @flow
import _ from "lodash";
import moment from "moment";
import { newGuid } from "commons/guid";

import type { SpanInfo } from "../../src/Domain/SpanInfo";

type SpanAbsoluteBounds = { from: number, to: number };

type SpanBounds = {
    from?: number,
    to?: number,
    length?: number,
    left?: number,
    right?: number,
};

class SpanBuilder {
    bounds: SpanBounds;
    id: string;
    parentId: ?string;
    childBuilders: Array<SpanBuilder>;

    constructor(bounds: SpanBounds) {
        this.bounds = bounds;
        this.childBuilders = [];
        this.parentId = null;
        this.id = newGuid();
    }

    parent(value: string): SpanBuilder {
        this.parentId = value;
        return this;
    }

    children(children: Array<SpanBuilder>): SpanBuilder {
        this.childBuilders = children;
        return this;
    }

    relativeTimestamp(relativeValue: number): string {
        return moment("2013-02-08T12:00:00.0000000Z")
            .add(relativeValue, "ms")
            .format("YYYY-MM-DDTHH:mm:ss.SSSSSSSSZ");
    }

    buildAbsoluteBounds(parentBounds?: SpanAbsoluteBounds): SpanAbsoluteBounds {
        const { from, to, length, left, right } = this.bounds;
        if (from != null && to != null) {
            return { from: from, to: to };
        }
        if (parentBounds == null) {
            throw new Error("Cannot create relative bounds without parent bound");
        }
        if (from != null && length != null) {
            return { from: from, to: from + length };
        }
        if (from != null && right != null) {
            return { from: from, to: parentBounds.to - right };
        }
        if (to != null && length != null) {
            return { from: to - length, to: to };
        }
        if (to != null && left != null) {
            return { from: parentBounds.from + left, to: to };
        }
        if (length != null && left != null) {
            return { from: parentBounds.from + left, to: parentBounds.from + left + length };
        }
        if (length != null && right != null) {
            return { from: parentBounds.to - right - length, to: parentBounds.to - right };
        }
        if (left != null && right != null) {
            return { from: parentBounds.from + left, to: parentBounds.to - right };
        }
        throw new Error("Incorrect bounds defintion");
    }

    build(parent?: SpanBuilder, parentBounds?: SpanAbsoluteBounds): Array<SpanInfo> {
        const absoluteBounds = this.buildAbsoluteBounds(parentBounds);
        return [
            {
                BeginTimestamp: this.relativeTimestamp(absoluteBounds.from),
                EndTimestamp: this.relativeTimestamp(absoluteBounds.to),
                TraceId: "831a3146-d50f-4fe1-b91e-d37b3197670d",
                SpanId: this.id,
                ParentSpanId: parent == null ? this.parentId : parent.id,
                OperationName: "Name",
                Annotations: {
                    OriginId: this.name,
                    OriginHost: this.host,
                    IsClientSpan: this.isClientSpan,
                },
            },
            ..._.flatten(this.childBuilders.map(x => x.build(this, absoluteBounds))),
        ];
    }
}

export default class Span {
    static create(bounds: SpanBounds): SpanBuilder {
        return new SpanBuilder(bounds);
    }
}
