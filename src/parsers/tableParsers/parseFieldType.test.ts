import { parseFieldType } from "./parseFieldType";
describe("parseFieldType", () => {
	test("number field", () => {
		const sql = parseFieldType({ type: "INT" });
		expect(sql).toBe("INT");
	});
	test("unsigned number field", () => {
		const sql = parseFieldType({ type: "INT", isUnsigned: true });
		expect(sql).toBe("INT UNSIGNED");
	});
	test("string length and enum dont have any power", () => {
		const sql = parseFieldType({
			type: "INT",
			isUnsigned: true,
			stringLen: 15,
			enumSetValues: [15, 15],
		});
		expect(sql).toBe("INT UNSIGNED");
	});
	test("string", () => {
		const sql = parseFieldType({ type: "VARCHAR", stringLen: 15 });
		expect(sql).toBe("VARCHAR(15)");
	});
	test("enum and unsigned dont have any power", () => {
		const sql = parseFieldType({
			type: "VARCHAR",
			stringLen: 15,
			isUnsigned: true,
			enumSetValues: [15, 15],
		});
		expect(sql).toBe("VARCHAR(15)");
	});
	test("throw because didn't pass length", () => {
		expect(() => parseFieldType({ type: "VARCHAR" })).toThrow();
	});
	test("enum", () => {
		const sql = parseFieldType({ type: "ENUM", enumSetValues: ["a", "b"] });
		expect(sql).toBe('ENUM("a","b")');
	});
	test("string length and unsigned dont have any power", () => {
		const sql = parseFieldType({
			type: "ENUM",
			enumSetValues: ["a", "b"],
			stringLen: 15,
			isUnsigned: true,
		});
		expect(sql).toBe('ENUM("a","b")');
	});
	test("throw because didn't pass values", () => {
		expect(() => parseFieldType({ type: "ENUM" })).toThrow();
	});
});
