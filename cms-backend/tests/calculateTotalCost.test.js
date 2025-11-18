const calculateTotalCost = require("../utils/calculateTotalCost");

describe("calculateTotalCost()", () => {

    test("returns correct total for valid price and quantity", () => {
        expect(calculateTotalCost(50, 3)).toBe(150);
    });

    test("returns 0 when price is negative", () => {
        expect(calculateTotalCost(-10, 5)).toBe(0);
    });

    test("returns 0 when quantity is zero", () => {
        expect(calculateTotalCost(50, 0)).toBe(0);
    });

    test("returns 0 when quantity is negative", () => {
        expect(calculateTotalCost(50, -2)).toBe(0);
    });
});
