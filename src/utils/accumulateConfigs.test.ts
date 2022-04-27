const config = {};

jest.mock("@/config", () => ({
	CONFIGS_OBJECT: config,
}));

describe("accumulateConfigs", () => {
	test("saveConfig", () => {
		return;
	});
});
