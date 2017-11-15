// @flow
import _ from "lodash";
import { createSpan, createSpanR2, createSpanR } from "./SpanBuildingUtils";

// 0. Длинные задержки сети
// 1. Очень длинный спан
// 2. Много спанов

export default {
    "831a3146-d50f-4fe1-b91e-d37b3197670d": {
        TraceId: "831a3146-d50f-4fe1-b91e-d37b3197670d",
        Spans: createSpan("Web.UI.FrontEnd", "vm-frn-01", 0, 900, false, [
            createSpan("Web.UI.Services", "vm-frn-01", 0, 10, false, [
                createSpan("Abonents", "vm-host-hst-01", 0, 10, false, [
                    createSpan("Zebra.TabletServer.Nonpaged", "zebra-hst-1", 0, 10, false, [
                        createSpan("Zebra.TabletServer.Nonpaged", "zebra-hst-2", 1, 2, false),
                        createSpan("Zebra.TabletServer.Nonpaged", "zebra-hst-2", 2, 3, false),
                        createSpan("Zebra.TabletServer.Nonpaged", "zebra-hst-2", 4, 10, false),
                    ]),
                ]),
            ]),
            createSpan("Web.UI.Services", "vm-frn-01", 10, 15, false),
            createSpan("Services", "vm-frn-01", 15, 21, false),
            createSpan("Services", "vm-frn-01", 23, 50, false),
            createSpan("Web.UI.Services", "", 52, 90, false),
            createSpan("Web.UI.Services", "", 100, 900, false, [
                createSpan("LinkService.Name", "", 100, 110, false, [
                    createSpan("LinkService.Name", "", 100, 110, false, [
                        createSpan("LinkService.Name", "", 101, 102, false),
                        createSpan("LinkService.Name", "", 102, 103, false),
                        createSpan("LinkService.Name", "", 104, 110, false),
                    ]),
                ]),
                createSpan("PartyService", "vm-host-01", 113, 900, false, [
                    createSpan("PartyService", "vm-host-01", 113, 900, false, [
                        createSpan("PartyService", "vm-host-01", 113, 900, false, [
                            createSpan("IndexService", "vm-idx-01", 113, 900, true, [createSpan("IndexService", "vm-idx-01", 800, 801, false)]),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    },
    example2: {
        TraceId: "example2",
        Spans: createSpan("", "", 0, 1200, false, [
            createSpanR("", "", 0, 20, false, [
                createSpan("", "", 0, 12, false),
                createSpanR("", "", 12, 16, false, [
                    createSpanR("", "", 0, 4, false, [
                        createSpanR("", "", 1, 3, false, [
                            createSpanR("", "", 1, 2, false, []),
                            createSpanR("", "", 0, 1, false, [
                                createSpanR("", "", 0, 1, false, [createSpanR("", "", 0, 1, false)]),
                            ]),
                        ]),
                    ]),
                ]),
                createSpan("", "", 18, 20, false),
            ]),
            createSpanR2("", "", 20, 900, false, [
                createSpanR2("", "", 0, 0, false, [
                    createSpanR2("", "", 0, -10, false, [
                        createSpanR2("", "", 0, -865, false),
                        createSpanR2("", "", 20, -10, false, [createSpanR2("", "", 0, -10, false, [])]),
                    ]),
                ]),
            ]),
            createSpan("", "", 900, 920, false),
            createSpan("", "", 930, 1200, false),
        ]),
    },
    example3: {
        TraceId: "example3",
        Spans: createSpan("", "", 0, 1200, false, [
            createSpanR("", "", 0, 20, false, [
                createSpan("", "", 0, 12, false),
                createSpanR("", "", 12, 16, false, [
                    createSpanR("", "", 0, 4, false, [
                        createSpanR("", "", 1, 3, false, [
                            createSpanR("", "", 1, 2, false, []),
                            createSpanR("", "", 0, 1, false, [
                                createSpanR("", "", 0, 1, false, [createSpanR("", "", 0, 1, false)]),
                            ]),
                        ]),
                    ]),
                ]),
                createSpan("", "", 18, 20, false),
            ]),
            createSpanR("", "", 20, 900, false, [
                createSpanR("", "", 0, 880, false, [
                    createSpanR("", "", 10, 870, false, [
                        createSpanR("", "", 3, 10, false),
                        createSpanR(
                            "",
                            "",
                            20,
                            850,
                            false,
                            _.range(0, 300).map(x => createSpan("", "", x * 2.1, x * 2.1 + 2, false, []))
                        ),
                    ]),
                ]),
            ]),
            createSpan("", "", 900, 920, false),
            createSpan("", "", 930, 1200, false),
        ]),
    },
};
