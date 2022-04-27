jest.mock("./receiveConfigs", () => ({
	receiveConfigs: {
		a: {
			table: "a",
			foreignKeys: {},
		},
	},
}));

describe("getJoinedFields", () => {
	describe("only keys", () => {
		test("a", () => {
			return;
		});
	});
	describe("with joinedTable", () => {
		test("b", () => {
			return;
		});
	});
	describe("with recurse", () => {
		test("c", () => {
			return;
		});
	});
});
