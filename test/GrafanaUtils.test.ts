import { expect } from "chai";

import { getGrafanaTraceUrl } from "../src/Domain/GrafanaUtils";

describe("GrafanaUtils", () => {
    describe("getGrafanaTraceUrl", () => {
        it("strips dashes from traceId", () => {
            const url = getGrafanaTraceUrl("4c62f7ba-d1f8-8a24-80dd-ad97eb6e0e35");
            expect(url).to.equal(
                "https://grafana.skbkontur.ru/d/osz6gm6/trace-viewer?orgId=1&from=now-6h&to=now&timezone=browser&var-traceId=4c62f7bad1f88a2480ddad97eb6e0e35"
            );
        });

        it("keeps traceId as-is when already without dashes", () => {
            const url = getGrafanaTraceUrl("4c62f7bad1f88a2480ddad97eb6e0e35");
            expect(url).to.equal(
                "https://grafana.skbkontur.ru/d/osz6gm6/trace-viewer?orgId=1&from=now-6h&to=now&timezone=browser&var-traceId=4c62f7bad1f88a2480ddad97eb6e0e35"
            );
        });

        it("returns base URL with empty var-traceId for empty string", () => {
            const url = getGrafanaTraceUrl("");
            expect(url).to.equal(
                "https://grafana.skbkontur.ru/d/osz6gm6/trace-viewer?orgId=1&from=now-6h&to=now&timezone=browser&var-traceId="
            );
        });

        it("returns base URL with empty var-traceId for undefined", () => {
            const url = getGrafanaTraceUrl();
            expect(url).to.equal(
                "https://grafana.skbkontur.ru/d/osz6gm6/trace-viewer?orgId=1&from=now-6h&to=now&timezone=browser&var-traceId="
            );
        });
    });
});
