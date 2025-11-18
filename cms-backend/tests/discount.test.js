const { applyDiscount } = require("../helpers/discount");

describe("applyDiscount()", () => {

  test("returns 0 when total is negative", () => {
    expect(applyDiscount(-100, 10)).toBe(0);
  });

  test("applies correct discount", () => {
    expect(applyDiscount(100, 10)).toBe(90);
    expect(applyDiscount(500, 20)).toBe(400);
  });

  test("handles zero discount", () => {
    expect(applyDiscount(200, 0)).toBe(200);
  });

  test("returns original total if discount > 100 or invalid", () => {
    expect(applyDiscount(300, 150)).toBe(300);
    expect(applyDiscount(300, "abc")).toBe(300);
  });

  test("supports decimal discounts", () => {
    expect(applyDiscount(100, 12.5)).toBe(87.5);
  });

});
