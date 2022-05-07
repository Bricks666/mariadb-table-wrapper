import { fullField } from "./fullField";

describe("fullField", () => {
	test("create full field", () => {
		expect(fullField("a", "a")).toBe("a.a");
	});
});
