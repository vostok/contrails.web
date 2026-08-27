import { normalizeTraceId } from "./Utils/TraceIdNormalizer";

const GRAFANA_BASE_URL =
    "https://grafana.skbkontur.ru/d/osz6gm6/trace-viewer?orgId=1&from=now-6h&to=now&timezone=browser&var-traceId=";

export function getGrafanaTraceUrl(traceId?: string): string {
    return GRAFANA_BASE_URL + (traceId ? normalizeTraceId(traceId) : "");
}
