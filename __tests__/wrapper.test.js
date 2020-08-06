const path  = require('path');
const validate = require('./inpValidations');
const HorusClientWrapper = require('../HorusClientWrapper.js');
// user will provide their own path to the stub integrated with horusClientWrapper
const stubWrapped = require(path.join(__dirname, "../stubs/booksStub"));

describe("...", () => {
  it('...', () => {
    expect(stubWrapped instanceof HorusClientWrapper).toBeTruthy();
    // last 3 arguments should be of string type
    // 3rd arg. should have .txt extension
    // 5th arg. should have a valid mongoUrl link type
    // expect(typeof stubWrapped.mongoURL).toBe("string");

  });
  it('should not throw error for a valid config file', () => {
    expect(() => validate(stubWrapped)).not.toThrow();
  });
  it("should throw error for missing or invalid 'serviceName' argument in constructor", () => {
    const errorMsg = "Please provide missing 'serviceName' argument in the position 4";
    // Missing serviceName argument
    expect(() => validateInput(stubWrapped)).toThrow(errorMsg);
  });
})