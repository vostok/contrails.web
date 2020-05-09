export function normalizeTraceId(traceId: string): string {
    return traceId.replace(/-/g, "");
}
