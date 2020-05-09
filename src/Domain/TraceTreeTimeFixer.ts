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

    public fix(): void {
        this.traverseTree(this.traceTree);
    }

    private traverseTree(node: SpanNode, parent?: SpanNode, offset?: number): void {
        if (parent != undefined) {
            const parentHostName = this.dataExtractor.getHostName(parent.source);
            const nodeHostName = this.dataExtractor.getHostName(node.source);

            if (nodeHostName !== parentHostName && this.dataExtractor.isServerSpan(node.source)) {
                offset = parent.from - node.from;
            }
        }

        node.status = this.dataExtractor.getStatus(node.source);

        if (offset != undefined) {
            node.from += offset;
            node.to += offset;
        }

        for (const child of node.children) {
            this.traverseTree(child, node, offset);
            node.status = TraceTreeTimeFixer.mergeStatus(node.status, child.status);
        }
    }
}
