import { addPrefix } from "./addPrefix";

describe("addPrefix", () => {
	test("base prefix", () => {
		expect(addPrefix("a", "a")).toBe("a.a");
	});
});
