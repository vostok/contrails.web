import { IDataExtractor } from "./IDataExtractor";
import { SpanNode, Status } from "./TraceTree/SpanNode";

export class TraceTreeTimeFixer {
    private readonly traceTree: SpanNode;
    private readonly dataExtractor: IDataExtractor;

    public constructor(traceTree: SpanNode, dataExtractor: IDataExtractor) {
        this.traceTree = traceTree;
        this.dataExtractor = dataExtractor;
    }

    private static mergeStatus(current: Status, child: Status): Status {
        if (child == Status.Fake || child == Status.Unknown) {
            return current;
        }

        if (current == Status.Unknown) {
            return child;
        }
        if (current == Status.Ok || current == Status.Fake) {
            return current;
        }

        return Math.max(current, child);
    }

    private static readonly TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

    public fix(): void {
        const rootDuration = this.traceTree.to - this.traceTree.from;
        const maxSpanDuration = Math.max(rootDuration * 10, TraceTreeTimeFixer.TEN_DAYS_MS);
        this.traverseTree(this.traceTree, undefined, undefined, maxSpanDuration);
    }

    private traverseTree(node: SpanNode, parent: SpanNode | undefined, offset: number | undefined, maxSpanDuration: number): void {
        if (parent != undefined) {
            const parentHostName = this.dataExtractor.getHostName(parent.source);
            const nodeHostName = this.dataExtractor.getHostName(node.source);

            if (nodeHostName !== parentHostName && this.dataExtractor.isServerSpan(node.source)) {
                offset = undefined;
                if (parent.from > node.from) {
                    offset = parent.from - node.from;
                } else if (parent.to < node.from) {
                    offset = parent.to - node.from;
                }
            }
        }

        node.status = this.dataExtractor.getStatus(node.source);

        if (offset != undefined) {
            node.from += offset;
            node.to += offset;
        }

        if (parent != undefined && node.from < parent.from) {
            node.from = parent.from;
        }

        if (node.to - node.from > maxSpanDuration) {
            node.to = node.from + maxSpanDuration;
        }

        for (const child of node.children) {
            this.traverseTree(child, node, offset, maxSpanDuration);
            node.status = TraceTreeTimeFixer.mergeStatus(node.status, child.status);
        }
    }
}
