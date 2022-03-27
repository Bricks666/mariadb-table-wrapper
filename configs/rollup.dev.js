import { baseConfig, generateOutput, getInputFile } from "./rollup.configs";

/** @type {import("rollup").RollupOptions} */
export default {
  input: getInputFile("dev"),
	output: [generateOutput("cjs", "dev"), generateOutput("es", "dev")],
	...baseConfig,
};
