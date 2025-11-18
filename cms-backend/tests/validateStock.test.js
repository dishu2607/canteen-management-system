const { validateStock } = require("../helpers/stock");

describe("validateStock()", () => {
  test("returns true when stock is sufficient", () => {
    expect(validateStock(2, 5)).toBe(true);
  });

  test("returns false when stock is insufficient", () => {
    expect(validateStock(5, 2)).toBe(false);
  });

  test("returns false when requested quantity is zero or negative", () => {
    expect(validateStock(0, 10)).toBe(false);
    expect(validateStock(-1, 10)).toBe(false);
  });

  test("returns false when stock is negative", () => {
    expect(validateStock(2, -5)).toBe(false);
  });
});
