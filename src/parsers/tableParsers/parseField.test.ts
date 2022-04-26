import { parseField } from "./parseField";
describe("parseField", () => {
	test("only type", () => {
		const sql = parseField(["a", { type: "BIGINT" }]);
		expect(sql).toBe("a BIGINT");
	});
	test("with primary key", () => {
		const sql = parseField(["a", { type: "BIGINT", isPrimaryKey: true }]);
		expect(sql).toBe("a BIGINT");
	});
	test("with auto increment", () => {
		const sql = parseField(["a", { type: "BIGINT", isAutoIncrement: true }]);
		expect(sql).toBe("a BIGINT AUTO_INCREMENT");
	});
	test("with unique", () => {
		const sql = parseField(["a", { type: "BIGINT", isUnique: true }]);
		expect(sql).toBe("a BIGINT UNIQUE");
	});
	test("with not null", () => {
		const sql = parseField(["a", { type: "BIGINT", isNotNull: true }]);
		expect(sql).toBe("a BIGINT NOT NULL");
	});
	test("unsigned", () => {
		const sql = parseField(["a", { type: "BIGINT", isUnsigned: true }]);
		expect(sql).toBe("a BIGINT UNSIGNED");
	});
	test("with default", () => {
		const sql = parseField(["a", { type: "BIGINT", default: 15 }]);
		expect(sql).toBe("a BIGINT DEFAULT 15");
	});
	test("with expression", () => {
		const sql = parseField([
			"a",
			{ type: "BIGINT", check: { operator: "<", value: 15 } },
		]);
		expect(sql).toBe("a BIGINT CHECK ((a < 15))");
	});
	test("all options", () => {
		const sql = parseField([
			"a",
			{
				type: "BIGINT",
				check: { operator: "!=", value: 15 },
				default: 15,
				isNotNull: true,
				isAutoIncrement: true,
				isPrimaryKey: true,
				isUnique: true,
				isUnsigned: true,
				stringLen: 32,
				enumSetValues: [15, 15],
			},
		]);
		expect(sql).toBe(
			"a BIGINT UNSIGNED UNIQUE AUTO_INCREMENT NOT NULL DEFAULT 15 CHECK ((a != 15))"
		);
	});
});
