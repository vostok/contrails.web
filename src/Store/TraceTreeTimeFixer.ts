import { IDataExtractor } from "../Domain/IDataExtractor";
import { SpanNode } from "../Domain/TraceTree/SpanNode";

interface HostOffsetInfo {
    offset: number;
    proposedOffsets: number[];
    fixedSpanIds: Set<string>;
}

export class TraceTreeTimeFixer {
    private readonly traceTree: SpanNode;
    private readonly dataExtractor: IDataExtractor;
    private readonly hostNameOffsets: Map<string, HostOffsetInfo> = new Map();

    public constructor(traceTree: SpanNode, dataExtractor: IDataExtractor) {
        this.traceTree = traceTree;
        this.dataExtractor = dataExtractor;
    }

    public fix(): void {
        this.traverseTree(this.traceTree, this.tryFixNode);
        console.log(this.hostNameOffsets);
        this.hostNameOffsets.clear();
        this.traverseTree(this.traceTree, this.tryFixNode);
        console.log(this.hostNameOffsets);
        this.hostNameOffsets.clear();
        this.traverseTree(this.traceTree, this.tryFixNode);
        console.log(this.hostNameOffsets);
    }

    private readonly tryFixNode = (parent: undefined | SpanNode, node: SpanNode): void => {
        if (parent == undefined) {
            return;
        }
        if (this.applyHostNameOffset(node)) {
            return;
        }
        const parentHostName = this.dataExtractor.getHostName(parent.source);
        const nodeHostName = this.dataExtractor.getHostName(node.source);
        if (nodeHostName === parentHostName) {
            return;
        }
        if (this.dataExtractor.isServerSpan(node.source) && this.dataExtractor.isClientSpan(parent.source)) {
            if (parent.from > node.from) {
                this.setHostNameOffset(nodeHostName, parent.from - node.from);
                this.applyHostNameOffset(node);
            }
            if (parent.to < node.to) {
                this.setHostNameOffset(nodeHostName, node.to - parent.to);
                this.applyHostNameOffset(node);
            }
        }
    };

    private setHostNameOffset(hostName: string, offset: number): void {
        const info = this.hostNameOffsets.get(hostName);
        if (info == undefined) {
            this.hostNameOffsets.set(hostName, { offset: offset, proposedOffsets: [], fixedSpanIds: new Set() });
        } else {
            info.proposedOffsets.push(offset);
        }
    }

    private traverseTree(
        node: SpanNode,
        visitor: (parent: undefined | SpanNode, node: SpanNode) => void,
        parent?: SpanNode
    ): void {
        visitor(parent, node);
        for (const child of node.children) {
            this.traverseTree(child, visitor, node);
        }
    }

    private applyHostNameOffset(node: SpanNode): boolean {
        const nodeHostName = this.dataExtractor.getHostName(node.source);
        const hostInfo = this.hostNameOffsets.get(nodeHostName);
        if (hostInfo == undefined) {
            return false;
        }
        if (hostInfo.fixedSpanIds.has(node.source.SpanId)) {
            return false;
        }
        hostInfo.fixedSpanIds.add(node.source.SpanId);
        node.from += hostInfo.offset;
        node.to += hostInfo.offset;
        return true;
    }
}
