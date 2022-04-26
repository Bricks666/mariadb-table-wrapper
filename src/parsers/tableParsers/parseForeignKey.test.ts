import { parseForeignKey } from "./parseForeignKey";

describe("parseForeignKey", () => {
	test("simple foreign key", () => {
		const sql = parseForeignKey("test-table", [
			"a",
			{ field: "a", tableName: "a" },
		]);
		expect(sql).toBe(
			"CONSTRAINT test-table_a_fk FOREIGN KEY (a) REFERENCES a (a) ON DELETE CASCADE ON UPDATE CASCADE"
		);
	});
	test("change delete and update reaction", () => {
		const sql = parseForeignKey("test-table", [
			"a",
			{
				field: "a",
				tableName: "a",
				onDelete: "NO ACTION",
				onUpdate: "RESTRICT",
			},
		]);
		expect(sql).toBe(
			"CONSTRAINT test-table_a_fk FOREIGN KEY (a) REFERENCES a (a) ON DELETE NO ACTION ON UPDATE RESTRICT"
		);
	});
});
