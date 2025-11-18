const validateRole = require("../utils/validateRole");

describe("validateRole()", () => {

    test("returns true for valid roles", () => {
        expect(validateRole("admin")).toBe(true);
        expect(validateRole("staff")).toBe(true);
        expect(validateRole("manager")).toBe(true);
    });

    test("returns false for invalid roles", () => {
        expect(validateRole("student")).toBe(false);
        expect(validateRole("guest")).toBe(false);
    });

    test("ignores case sensitivity", () => {
        expect(validateRole("AdMiN")).toBe(true);
    });

    test("returns false for null or empty role", () => {
        expect(validateRole(null)).toBe(false);
        expect(validateRole("")).toBe(false);
    });

    test("returns false for non-string roles", () => {
        expect(validateRole(123)).toBe(false);
        expect(validateRole({})).toBe(false);
    });

});
