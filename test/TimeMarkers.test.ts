import { expect } from "chai";

import { generateTimeMarkers } from "../src/Domain/TimeMarkers";

describe("generateTimeMarkers", () => {
    it("works", () => {
        const result = generateTimeMarkers(0, 10000, 1000);
        expect(result).to.have.length(11);

        expect(result[0].title).to.eql("0s");
        expect(result[0].value).to.eql(0);

        expect(result[1].title).to.eql("1s");
        expect(result[1].value).to.eql(1000);
    });

    it("works 2", () => {
        const result = generateTimeMarkers(100, 10000, 1000);
        expect(result).to.have.length(10);

        expect(result[0].title).to.eql("1s");
        expect(result[0].value).to.eql(1000);
    });

    it("works 3", () => {
        const result = generateTimeMarkers(0, 1000, 100);
        expect(result).to.have.length(11);

        expect(result[0].title).to.eql("0ms");
        expect(result[0].value).to.eql(0);

        expect(result[1].title).to.eql("100ms");
        expect(result[1].value).to.eql(100);
    });

    it("works 3", () => {
        const result = generateTimeMarkers(0, 1000, 99);
        expect(result).to.have.length(11);

        expect(result[0].title).to.eql("0ms");
        expect(result[0].value).to.eql(0);

        expect(result[1].title).to.eql("100ms");
        expect(result[1].value).to.eql(100);

        expect(result[2].title).to.eql("200ms");
        expect(result[2].value).to.eql(200);
    });

    it("works 3", () => {
        const result = generateTimeMarkers(0, 1000, 101);
        // expect(result).to.have.length(11);

        expect(result[0].title).to.eql("0ms");
        expect(result[0].value).to.eql(0);

        expect(result[1].title).to.eql("150ms");
        expect(result[1].value).to.eql(150);

        expect(result[2].title).to.eql("300ms");
        expect(result[2].value).to.eql(300);
    });
});
