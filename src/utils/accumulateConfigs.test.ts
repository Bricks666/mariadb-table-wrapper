import { accumulateConfigs } from "./accumulateConfigs";
import { CONFIGS_OBJECT } from "@/config";

const tableName = "a";

jest.mock("@/config", () => ({
	CONFIGS_OBJECT: {},
}));

describe("accumulateConfigs", () => {
	test("saveConfig", () => {
		accumulateConfigs({ table: tableName, fields: {} });
		expect(CONFIGS_OBJECT[tableName]).toBeTruthy();
	});
	test("rewriteConfig", () => {
		accumulateConfigs({
			table: tableName,
			fields: {
				a: {
					type: "BIGINT",
				},
			},
		});
		expect(CONFIGS_OBJECT[tableName]?.fields.a).toBeTruthy();
	});
});
