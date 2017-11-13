// @flow
import { expect } from "chai";
import _ from "lodash";

import { fixLogsearchClientServerSpan } from "../src/Domain/ContrailsLogsearchApi";

describe("fixLogsearchClientServerSpan", () => {
    it("Простой случай", () => {
        const source = [
            {
                TraceId: "285379f671b542b6a2fc00d965eb1894",
                SpanId: "b42103d1000000000000000000000000",
                OperationName: "HTTP",
                BeginTimestamp: "2017-11-13T10:08:03.8030000+03:00",
                EndTimestamp: "2017-11-13T10:08:05.1329634+03:00",
                Annotations: { OriginHost: "vm-livechat1", OriginId: "LiveChat.Service", IsClientSpan: false },
            },
            {
                TraceId: "285379f671b542b6a2fc00d965eb1894",
                SpanId: "d4061a4d000000000000000000000000",
                ParentSpanId: "b42103d1000000000000000000000000",
                OperationName: "HTTP",
                BeginTimestamp: "2017-11-13T10:08:05.0920000+03:00",
                EndTimestamp: "2017-11-13T10:08:05.1328909+03:00",
                Annotations: {
                    OriginHost: "vm-livechat1",
                    OriginId: "LiveChat.Service",
                    IsClientSpan: true,
                    ClientRequestMethod: "POST",
                    ClientTargetHost: "vm-livechat3",
                    ClientRequestBodySize: 90,
                    ClientRequestUrlHash: -1942501628,
                    ClientResponseCode: 200,
                    ClientTargetPort: 31414,
                    ClientResponseBodySize: 78,
                },
            },
            {
                TraceId: "285379f671b542b6a2fc00d965eb1894",
                SpanId: "d4061a4d000000000000000000000000",
                ParentSpanId: "b42103d1000000000000000000000000",
                OperationName: "HTTP",
                BeginTimestamp: "2017-11-13T10:08:05.1030000+03:00",
                EndTimestamp: "2017-11-13T10:08:05.1430732+03:00",
                Annotations: {
                    OriginHost: "vm-livechat3",
                    OriginId: "LiveChat.Service",
                    IsClientSpan: false,
                },
            },
        ];

        const result = fixLogsearchClientServerSpan(source);
        expect(_.uniq(result.map(x => x.SpanId)).length).to.eql(3);
        expect(result[1].SpanId).to.eql(result[2].ParentSpanId);
    });
});
