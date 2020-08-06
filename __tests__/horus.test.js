const horusCW = require("../HorusClientWrapper.js");

describe('"Horus Client and Server wrappers tests', () => {
  describe("checking for all appropriate methods", () => {
    it("should have the 'metadata' property", () => {
      expect(horusCW).toHaveProperty("metadata");
    });
    it("'metadata' property should be an object", () => {
      expect(typeof horusCW.metadata).toBa("Object");
    });
    it("should have the 'model' property", () => {
      expect(horusCW).toHaveProperty("model");
    });
  });
});
