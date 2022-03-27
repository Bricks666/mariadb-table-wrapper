import { baseConfig, generateOutput, getInputFile } from "./rollup.configs";

export default {
	input: getInputFile("prod"),
	output: [generateOutput("cjs", "prod"), generateOutput("es", "prod")],
	...baseConfig,
};
