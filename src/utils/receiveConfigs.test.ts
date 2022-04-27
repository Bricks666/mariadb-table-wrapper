import { receiveConfigs } from "./receiveConfigs";

jest.mock("@/config", () => ({
	CONFIGS_OBJECT: {
		a: {},
	},
}));

describe("receiveConfig", () => {
	test("receive config", () => {
		const config = receiveConfigs("a");
		expect(config).toEqual({});
	});
	test("return undefined", () => {
		const config = receiveConfigs("b");
		expect(config).toEqual(undefined);
	});
});
