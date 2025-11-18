const { calculateOrderTotal } = require("../helpers/calcTotal");

describe("calculateOrderTotal()", () => {
  
  test("returns 0 for empty cart", () => {
    expect(calculateOrderTotal([])).toBe(0);
  });

  test("correctly calculates total for a simple cart", () => {
    const cart = [
      { price: 50, qty: 2 },
      { price: 30, qty: 1 }
    ];
    expect(calculateOrderTotal(cart)).toBe(130);
  });

  test("ignores items with negative qty or price", () => {
    const cart = [
      { price: 20, qty: -1 },
      { price: -100, qty: 3 },
      { price: 10, qty: 2 }
    ];
    expect(calculateOrderTotal(cart)).toBe(20);
  });

  test("handles floating prices", () => {
    const cart = [
      { price: 99.99, qty: 1 },
      { price: 10.5, qty: 2 }
    ];
    expect(calculateOrderTotal(cart)).toBeCloseTo(120.99);
  });

  test("returns 0 when invalid input is passed", () => {
    expect(calculateOrderTotal("hello")).toBe(0);
    expect(calculateOrderTotal(null)).toBe(0);
  });

});
